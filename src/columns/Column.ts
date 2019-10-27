import Table from '../Table';
import EqualOperator, { EqualRHS } from '../operators/EqualOperator';
import OrderByExpression from '../OrderByExpression';

export default class Column {
  readonly table: Table<any>;
  readonly name: string;

  constructor(table: Table<any>, name: string) {
    this.table = table;
    this.name = name;
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
      return `"${this.table.name}"."${this.name}"`;
    }
  }
}
