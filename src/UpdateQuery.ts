import Table from './Table';
import QueryValues from './QueryValues';
import whereConditionsToOperators from './whereConditionsToOperators';
import getClient from './getClient';
import { Schema, ResourceClass, Attributes, WhereConditions } from './types';

export default class UpdateQuery<
  TSchema extends Schema,
  TResource extends ResourceClass<TSchema>
> implements PromiseLike<InstanceType<TResource>[]> {
  protected readonly table: Table<TSchema>;
  protected readonly resourceClass: TResource;
  protected readonly conditions: WhereConditions<TSchema>;
  protected readonly attributes: Partial<Attributes<TSchema>>;

  constructor(
    resourceClass: TResource,
    conditions: WhereConditions<TSchema>,
    attributes: Partial<Attributes<TSchema>>
  ) {
    this.table = resourceClass.table;
    this.resourceClass = resourceClass;
    this.conditions = conditions;
    this.attributes = attributes;
  }

  toSQL() {
    // TODO: Update QueryValues to support column names
    const values = new QueryValues(...Object.values(this.attributes));

    const setSQL = Object.keys(this.attributes)
      .map((columnName, index) => `"${columnName}" = $${index + 1}`)
      .join(', ');

    const whereSQL = whereConditionsToOperators(
      this.table,
      this.conditions
    ).toSQL(values);

    return {
      text: `UPDATE ${this.table.toSQL()} SET ${setSQL} WHERE ${whereSQL} RETURNING *`,
      values: values.toArray()
    };
  }

  then(
    onfulfilled?: ((value: InstanceType<TResource>[]) => unknown) | null,
    onrejected?: () => any
  ) {
    const { text, values } = this.toSQL();

    return this.client
      .then(client => {
        return client.query(text, values);
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
