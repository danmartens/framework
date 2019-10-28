import ResourceQueryBuilder from './ResourceQueryBuilder';
import Table from './Table';
import { TableSchema, ResourceClass } from './types';

export default abstract class Repository<
  TSchema extends TableSchema,
  TResource extends ResourceClass<TSchema>,
  TPrimaryKey = number
> {
  abstract readonly table: Table<TSchema>;
  abstract readonly resourceClass: TResource;

  protected get queryBuilder(): ResourceQueryBuilder<
    TSchema,
    TResource,
    TPrimaryKey
  > {
    return new ResourceQueryBuilder(this.resourceClass);
  }
}
