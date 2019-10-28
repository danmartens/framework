import DataLoader from 'dataloader';

import Table from './Table';
import OrderByExpression from './OrderByExpression';
import Operator from './operators/Operator';
import EqualOperator from './operators/EqualOperator';
import JoinClause, { JoinType } from './JoinClause';
import Column from './columns/Column';
import Query from './Query';
import getClient from './getClient';
import {
  TableSchema,
  ResourceClass,
  QueryOptions,
  WhereConditions,
  OrderConditions
} from './types';

export default class QueryBuilder<
  TSchema extends TableSchema,
  TResource extends ResourceClass<TSchema>,
  TPrimaryKey = number
> implements PromiseLike<InstanceType<TResource>[]> {
  protected readonly table: Table<TSchema>;
  protected readonly resourceClass: TResource;
  protected readonly options: QueryOptions;
  protected readonly dataLoader: DataLoader<
    TPrimaryKey,
    InstanceType<TResource>
  >;

  constructor(resourceClass: TResource, options?: QueryOptions) {
    this.table = resourceClass.table;
    this.resourceClass = resourceClass;
    this.options = options || {};

    this.dataLoader = new DataLoader(async ids => {
      const resources = await this.where(this.table.col('id').eq(ids));

      return ids.map(id => resources.find(resource => resource.id === id));
    });
  }

  select(...columns: Array<Column | keyof TSchema>): this {
    const select = this.options.select || [];

    return new QueryBuilder(this.resourceClass as any, {
      ...this.options,
      select: [
        ...select,
        ...columns.map(columnOrColumnName => {
          if (columnOrColumnName instanceof Column) {
            return columnOrColumnName;
          } else {
            return this.table.col(columnOrColumnName);
          }
        })
      ]
    }) as this;
  }

  async find(id: TPrimaryKey) {
    return this.dataLoader.load(id);
  }

  where(...conditions: Array<WhereConditions<TSchema> | Operator>): this {
    let where = whereConditionsToOperators(this.table, conditions);

    if (this.options.where != null) {
      where = this.options.where.and(where);
    }

    return new QueryBuilder(this.resourceClass as any, {
      ...this.options,
      where
    }) as this;
  }

  orWhere(...conditions: Array<WhereConditions<TSchema> | Operator>): this {
    let where = whereConditionsToOperators(this.table, conditions);

    if (this.options.where != null) {
      where = this.options.where.or(where);
    }

    return new QueryBuilder(this.resourceClass as any, {
      ...this.options,
      where
    }) as this;
  }

  join(type: JoinType, table: Table<any>, operator: EqualOperator): this {
    const join = this.options.join || [];

    join.push(new JoinClause(type, table, operator));

    return new QueryBuilder(this.resourceClass as any, {
      ...this.options,
      join
    }) as this;
  }

  innerJoin(table: Table<any>, operator: EqualOperator): this {
    return this.join(JoinType.Inner, table, operator);
  }

  orderBy(conditions: OrderConditions<TSchema> | OrderByExpression): this {
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

    return new QueryBuilder(this.resourceClass as any, {
      ...this.options,
      orderBy
    }) as this;
  }

  limit(limit: number): this {
    return new QueryBuilder(this.resourceClass as any, {
      ...this.options,
      limit
    }) as this;
  }

  offset(offset: number): this {
    return new QueryBuilder(this.resourceClass as any, {
      ...this.options,
      offset
    }) as this;
  }

  toSQL() {
    return new Query(this.table, this.options).toSQL();
  }

  then(
    onfulfilled?: ((value: InstanceType<TResource>[]) => unknown) | null,
    onrejected?: () => any
  ) {
    return this.client
      .then(client => {
        return client.query(this.toSQL());
      })
      .then(result => {
        return result.rows.map(
          row => new this.resourceClass(row) as InstanceType<TResource>
        );
      })
      .then(onfulfilled, onrejected);
  }

  protected get client() {
    return getClient();
  }
}

function whereConditionsToOperators(
  table: Table<any>,
  conditions: Array<WhereConditions<any> | Operator>
): Operator {
  let where;

  for (const condition of conditions) {
    if (condition instanceof Operator) {
      if (where == null) {
        where = condition;
      } else {
        where = where.and(condition);
      }
    } else {
      for (const [key, value] of Object.entries(condition)) {
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
  }

  return where;
}
