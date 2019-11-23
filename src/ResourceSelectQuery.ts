import DataLoader from 'dataloader';

import OrderByExpression from './OrderByExpression';
import EqualOperator from './operators/EqualOperator';
import { JoinType } from './JoinClause';
import {
  Schema,
  ResourceClass,
  QueryOptions,
  WhereConditions,
  OrderConditions
} from './types';
import SelectQuery from './SelectQuery';
import Table from './Table';

export default class ResourceSelectQuery<
  TSchema extends Schema,
  TResource extends ResourceClass<TSchema>,
  TPrimaryKey = number
> extends SelectQuery<TSchema>
  implements PromiseLike<InstanceType<TResource>[]> {
  protected readonly resourceClass: TResource;
  protected readonly dataLoader: DataLoader<
    TPrimaryKey,
    InstanceType<TResource>
  >;

  constructor(resourceClass: TResource, options?: QueryOptions) {
    super(resourceClass.table, options);

    this.resourceClass = resourceClass;

    // @ts-ignore
    this.dataLoader = new DataLoader(async ids => {
      // @ts-ignore
      const resources = await this.where(this.table.col('id').eq(ids));

      // @ts-ignore
      return ids.map(id => resources.find(resource => resource.id === id));
    });
  }

  find(ids: TPrimaryKey): Promise<InstanceType<TResource>>;
  find(ids: TPrimaryKey[]): Promise<InstanceType<TResource>[]>;

  find(ids: TPrimaryKey | TPrimaryKey[]) {
    if (Array.isArray(ids)) {
      return this.dataLoader.loadMany(ids);
    } else {
      return this.dataLoader.load(ids);
    }
  }

  where(
    conditions: WhereConditions<TSchema>
  ): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return super.where(conditions) as ResourceSelectQuery<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  orWhere(
    conditions: WhereConditions<TSchema>
  ): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return super.orWhere(conditions) as ResourceSelectQuery<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  join(
    type: JoinType,
    table: Table<any>,
    operator: EqualOperator
  ): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return super.join(type, table, operator) as ResourceSelectQuery<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  innerJoin(
    table: Table<any>,
    operator: EqualOperator
  ): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return super.innerJoin(table, operator) as ResourceSelectQuery<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  orderBy(
    conditions: OrderConditions<TSchema> | OrderByExpression
  ): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return super.orderBy(conditions) as ResourceSelectQuery<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  limit(limit: number): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return super.limit(limit) as ResourceSelectQuery<
      TSchema,
      TResource,
      TPrimaryKey
    >;
  }

  offset(offset: number): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return super.offset(offset) as ResourceSelectQuery<
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
  ): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return new ResourceSelectQuery(this.resourceClass, {
      ...this.options,
      ...options
    });
  }
}
