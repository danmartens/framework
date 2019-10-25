import Table from './Table';
import EqualOperator, { EqualRHS } from './EqualOperator';

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

  toString() {
    if (this.name === '*') {
      return `"${this.table.name}".*`;
    } else {
      return `"${this.table.name}"."${this.name}"`;
    }
  }
}
