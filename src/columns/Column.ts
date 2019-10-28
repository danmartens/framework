import Table from '../Table';
import EqualOperator, { RHS as EqualRHS } from '../operators/EqualOperator';
import NotEqualOperator, {
  RHS as NotEqualRHS
} from '../operators/NotEqualOperator';
import OrderByExpression from '../OrderByExpression';
import CountFunction from '../CountFunction';

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

  notEq(rhs: NotEqualRHS) {
    return new NotEqualOperator(this, rhs);
  }

  asc() {
    return new OrderByExpression(this, 'ASC');
  }

  desc() {
    return new OrderByExpression(this, 'DESC');
  }

  count(alias?: string) {
    return new CountFunction(this, alias);
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
