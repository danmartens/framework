import Table from './Table';
import QueryValues from './QueryValues';
import getClient from './getClient';
import { Schema, ResourceClass, Attributes } from './types';

export default class InsertQuery<
  TSchema extends Schema,
  TResource extends ResourceClass<TSchema>
> implements PromiseLike<InstanceType<TResource>> {
  protected readonly table: Table<TSchema>;
  protected readonly resourceClass: TResource;
  protected readonly attributes: Partial<Attributes<TSchema>>;

  constructor(
    resourceClass: TResource,
    attributes: Partial<Attributes<TSchema>>
  ) {
    this.table = resourceClass.table;
    this.resourceClass = resourceClass;
    this.attributes = attributes;
  }

  toSQL() {
    const values = new QueryValues(...Object.values(this.attributes));

    return {
      text: `INSERT INTO ${this.table.toSQL()} (${Object.keys(
        this.attributes
      ).join(', ')}) ${values.toSQL()} RETURNING *`,
      values: values.toArray()
    };
  }

  then(
    onfulfilled?: ((value: InstanceType<TResource>) => unknown) | null,
    onrejected?: () => any
  ) {
    const { text, values } = this.toSQL();

    return this.client
      .then(client => {
        return client.query(text, values);
      })
      .then(result => {
        return new this.resourceClass(result.rows[0]) as InstanceType<
          TResource
        >;
      })
      .then(onfulfilled, onrejected);
  }

  protected get client() {
    return getClient();
  }
}
