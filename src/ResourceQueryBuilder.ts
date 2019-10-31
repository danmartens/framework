import DataLoader from 'dataloader';

import OrderByExpression from './OrderByExpression';
import EqualOperator from './operators/EqualOperator';
import { JoinType } from './JoinClause';
import {
  TableSchema,
  ResourceClass,
  QueryOptions,
  WhereConditions,
  OrderConditions
} from './types';
import QueryBuilder from './QueryBuilder';
import Table from './Table';

export default class ResourceQueryBuilder<
  TSchema extends TableSchema,
  TResource extends ResourceClass<TSchema>,
  TPrimaryKey = number
> extends QueryBuilder<TSchema>
  implements PromiseLike<InstanceType<TResource>[]> {
  protected readonly resourceClass: TResource;
  protected readonly dataLoader: DataLoader<
    TPrimaryKey,
    InstanceType<TResource>
  >;

  constructor(resourceClass: TResource, options?: QueryOptions) {
    super(resourceClass.table, options);

    this.resourceClass = resourceClass;

    this.dataLoader = new DataLoader(async ids => {
      const resources = await this.where(this.table.col('id').eq(ids));

      return ids.map(id => resources.find(resource => resource.id === id));
    });
  }

  find(ids: TPrimaryKey | TPrimaryKey[]) {
    if (Array.isArray(ids)) {
      return this.dataLoader.loadMany(ids);
    } else {
      return this.dataLoader.load(ids);
    }
  }

  where(
    conditions: WhereConditions<TSchema>
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return super.where(conditions) as ResourceQueryBuilder<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  orWhere(
    conditions: WhereConditions<TSchema>
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return super.orWhere(conditions) as ResourceQueryBuilder<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  join(
    type: JoinType,
    table: Table<any>,
    operator: EqualOperator
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return super.join(type, table, operator) as ResourceQueryBuilder<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  innerJoin(
    table: Table<any>,
    operator: EqualOperator
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return super.innerJoin(table, operator) as ResourceQueryBuilder<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  orderBy(
    conditions: OrderConditions<TSchema> | OrderByExpression
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return super.orderBy(conditions) as ResourceQueryBuilder<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  limit(limit: number): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return super.limit(limit) as ResourceQueryBuilder<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  offset(
    offset: number
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return super.offset(offset) as ResourceQueryBuilder<
      TSchema,
      TResource,
      TPrimaryKey
    >;
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

  protected mergeOptions(
    options: QueryOptions
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return new ResourceQueryBuilder(this.resourceClass, {
      ...this.options,
      ...options
    });
  }
}
