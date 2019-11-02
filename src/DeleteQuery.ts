import Table from './Table';
import QueryValues from './QueryValues';
import whereConditionsToOperators from './whereConditionsToOperators';
import getClient from './getClient';
import { Schema, ResourceClass, WhereConditions } from './types';

export default class DeleteQuery<
  TSchema extends Schema,
  TResource extends ResourceClass<TSchema>
> implements PromiseLike<InstanceType<TResource>[]> {
  protected readonly table: Table<TSchema>;
  protected readonly resourceClass: TResource;
  protected readonly conditions: WhereConditions<TSchema>;

  constructor(resourceClass: TResource, conditions: WhereConditions<TSchema>) {
    this.table = resourceClass.table;
    this.resourceClass = resourceClass;
    this.conditions = conditions;
  }

  toSQL() {
    const values = new QueryValues();

    const whereSQL = whereConditionsToOperators(
      this.table,
      this.conditions
    ).toSQL(values);

    return {
      text: `DELETE FROM ${this.table.toSQL()} WHERE ${whereSQL} RETURNING *`,
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
