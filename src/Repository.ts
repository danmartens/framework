import ResourceQueryBuilder from './ResourceQueryBuilder';
import Table from './Table';
import InsertQuery from './InsertQuery';
import { Schema, ResourceClass, WhereConditions, Attributes } from './types';

export default abstract class Repository<
  TSchema extends Schema,
  TResource extends ResourceClass<TSchema>,
  TPrimaryKey = number
> {
  abstract readonly resourceClass: TResource;
  private _query?: ResourceQueryBuilder<TSchema, TResource, TPrimaryKey>;

  find(ids: TPrimaryKey[]) {
    return this.query.find(ids);
  }

  where(
    conditions: WhereConditions<TSchema>
  ): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    return this.query.where(conditions);
  }

  protected get table(): Table<TSchema> {
    return this.resourceClass.table;
  }

  protected get query(): ResourceQueryBuilder<TSchema, TResource, TPrimaryKey> {
    if (this._query == null) {
      this._query = new ResourceQueryBuilder(this.resourceClass);
    }

    return this._query;
  }

  async insert(attributes: Partial<Attributes<TSchema>>) {
    return new InsertQuery(this.resourceClass, attributes);
  }
}
