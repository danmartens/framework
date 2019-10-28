import Table from './Table';
import EqualOperator from './operators/EqualOperator';
import QueryValues from './QueryValues';

export enum JoinType {
  Inner = 'INNER',
  LeftOuter = 'LEFT OUTER',
  RightOuter = 'Right OUTER'
}

export default class JoinClause {
  protected readonly type: JoinType;
  protected readonly table: Table<any>;
  protected readonly operator: EqualOperator;

  constructor(type: JoinType, table: Table<any>, operator: EqualOperator) {
    this.type = type;
    this.table = table;
    this.operator = operator;
  }

  toSQL(values: QueryValues) {
    return `${this.type} JOIN "${this.table.name}" ON ${this.operator.toSQL(
      values
    )}`;
  }
}
