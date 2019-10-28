import Column from './columns/Column';

export default class CountFunction {
  protected readonly column: Column;
  protected readonly alias?: string;

  constructor(column: Column, alias?: string) {
    this.column = column;
    this.alias = alias;
  }

  get table() {
    return this.column.table;
  }

  toSQL() {
    const sql = `COUNT(${this.column.toSQL()})`;

    if (this.alias != null) {
      return `${sql} AS ${this.alias}`;
    }

    return sql;
  }
}
