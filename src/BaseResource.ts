import Table from './Table';
import { TableSchema, TableAttributes } from './types';

export default abstract class BaseResource<TSchema extends TableSchema> {
  static readonly table: Table<any>;
  protected readonly attributes: TableAttributes<TSchema>;

  constructor(attributes: TableAttributes<TSchema>) {
    this.attributes = attributes;
  }

  get id() {
    return this.attributes.id;
  }
}
