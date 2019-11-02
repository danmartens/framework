import Table from './Table';
import OrderByExpression from './OrderByExpression';
import Operator from './operators/Operator';
import EqualOperator from './operators/EqualOperator';
import JoinClause, { JoinType } from './JoinClause';
import Column from './columns/Column';
import Query from './Query';
import getClient from './getClient';
import {
  Schema,
  QueryOptions,
  WhereConditions,
  OrderConditions
} from './types';
import CountFunction from './CountFunction';

export default class QueryBuilder<TSchema extends Schema>
  implements PromiseLike<object[]> {
  protected readonly table: Table<TSchema>;
  protected readonly options: QueryOptions;

  constructor(table: Table<TSchema>, options?: QueryOptions) {
    this.table = table;
    this.options = options || {};
  }

  select(
    ...columns: Array<Column | CountFunction | keyof TSchema>
  ): QueryBuilder<TSchema> {
    const select = this.options.select || [];

    return new QueryBuilder(this.table, {
      ...this.options,
      select: [
        ...select,
        ...columns.map(columnOrColumnName => {
          if (
            columnOrColumnName instanceof Column ||
            columnOrColumnName instanceof CountFunction
          ) {
            return columnOrColumnName;
          } else {
            return this.table.col(columnOrColumnName);
          }
        })
      ]
    });
  }

  where(conditions: WhereConditions<TSchema>) {
    let where = whereConditionsToOperators(this.table, conditions);

    if (this.options.where != null) {
      where = this.options.where.and(where);
    }

    return this.mergeOptions({ where });
  }

  orWhere(conditions: WhereConditions<TSchema>) {
    let where = whereConditionsToOperators(this.table, conditions);

    if (this.options.where != null) {
      where = this.options.where.or(where);
    }

    return this.mergeOptions({ where });
  }

  join(type: JoinType, table: Table<any>, operator: EqualOperator) {
    const join = this.options.join || [];

    join.push(new JoinClause(type, table, operator));

    return this.mergeOptions({ join });
  }

  innerJoin(table: Table<any>, operator: EqualOperator) {
    return this.join(JoinType.Inner, table, operator);
  }

  orderBy(conditions: OrderConditions<TSchema> | OrderByExpression) {
    const orderBy = this.options.orderBy || [];

    if (conditions instanceof OrderByExpression) {
      orderBy.push(conditions);
    } else {
      for (const [columnName, direction] of Object.entries(conditions)) {
        if (direction != null) {
          orderBy.push(
            new OrderByExpression(this.table.col(columnName), direction)
          );
        }
      }
    }

    return this.mergeOptions({ orderBy });
  }

  limit(limit: number) {
    return this.mergeOptions({
      limit
    });
  }

  offset(offset: number) {
    return this.mergeOptions({
      offset
    });
  }

  toSQL() {
    return new Query(this.table, this.options).toSQL();
  }

  then(
    onfulfilled?: ((value: object[]) => unknown) | null,
    onrejected?: () => any
  ) {
    return this.client
      .then(client => {
        return client.query(this.toSQL());
      })
      .then(result => {
        return result.rows;
      })
      .then(onfulfilled, onrejected);
  }

  protected mergeOptions(options: QueryOptions): QueryBuilder<TSchema> {
    return new QueryBuilder(this.table, {
      ...this.options,
      ...options
    });
  }

  protected get client() {
    return getClient();
  }
}

function whereConditionsToOperators<TSchema extends Schema>(
  table: Table<any>,
  conditions: WhereConditions<TSchema>
): Operator {
  let where;

  if (conditions instanceof Operator) {
    where = conditions;
  } else if (typeof conditions === 'function') {
    where = conditions(table);
  } else {
    for (const [key, value] of Object.entries(conditions)) {
      let operator;

      if (Array.isArray(value)) {
        operator = table.col(key).in(value);
      } else {
        operator = table.col(key).eq(value);
      }

      if (where == null) {
        where = operator;
      } else {
        where = where.and(operator);
      }
    }
  }

  return where;
}
