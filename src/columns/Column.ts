import Table from '../Table';
import EqualOperator, { EqualRHS } from '../operators/EqualOperator';
import OrderByExpression from '../OrderByExpression';

export default class Column {
  readonly table: Table<any>;
  readonly name: string;
  protected readonly alias?: string;

  constructor(table: Table<any>, name: string, alias?: string) {
    this.table = table;
    this.name = name;
    this.alias = alias;
  }

  as(alias: string) {
    return new Column(this.table, this.name, alias);
  }

  eq(rhs: EqualRHS) {
    return new EqualOperator(this, rhs);
  }

  asc() {
    return new OrderByExpression(this, 'ASC');
  }

  desc() {
    return new OrderByExpression(this, 'DESC');
  }

  toSQL() {
    if (this.name === '*') {
      return `"${this.table.name}".*`;
    } else {
      const sql = `"${this.table.name}"."${this.name}"`;

      if (this.alias != null) {
        return `${sql} AS "${this.alias}"`;
      }

      return sql;
    }
  }
}
