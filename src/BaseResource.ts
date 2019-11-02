import Table from './Table';
import { Schema, Attributes } from './types';

export default abstract class BaseResource<TSchema extends Schema> {
  static readonly table: Table<any>;
  protected readonly attributes: Attributes<TSchema>;

  constructor(attributes: Attributes<TSchema>) {
    this.attributes = attributes;
  }

  get id() {
    return this.attributes.id;
  }
}
