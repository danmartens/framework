import Table from './Table';
import QueryValues from './QueryValues';
import { QueryOptions } from './types';

export default class Query {
  protected readonly table: Table<any>;
  protected readonly options: QueryOptions;

  constructor(table: Table<any>, options: QueryOptions) {
    this.table = table;
    this.options = options;
  }

  toSQL() {
    const values = new QueryValues();

    const text = [
      this.selectSQL(),
      this.fromSQL(),
      this.joinSQL(values),
      this.whereSQL(values),
      this.orderBySQL(),
      this.limitSQL(),
      this.offsetSQL()
    ]
      .filter(sql => sql != null)
      .join(' ');

    return { text, values: values.toArray() };
  }

  protected fromSQL() {
    return `FROM ${this.table.toSQL()}`;
  }

  protected selectSQL() {
    const { select } = this.options;

    return select == null
      ? `SELECT *`
      : `SELECT ${select.map(column => column.toSQL()).join(', ')}`;
  }

  protected joinSQL(values: QueryValues) {
    const { join } = this.options;

    return join != null
      ? join.map(expression => expression.toSQL(values)).join(' ')
      : null;
  }

  protected whereSQL(values: QueryValues) {
    const { where } = this.options;

    return where != null ? `WHERE ${where.toSQL(values)}` : null;
  }

  protected orderBySQL() {
    const { orderBy } = this.options;

    return orderBy != null
      ? `ORDER BY ${orderBy.map(expression => expression.toSQL()).join(', ')}`
      : null;
  }

  protected limitSQL() {
    const { limit } = this.options;

    return limit != null ? `LIMIT ${limit}` : null;
  }

  protected offsetSQL() {
    const { offset } = this.options;

    return offset != null ? `OFFSET ${offset}` : null;
  }
}
