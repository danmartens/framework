import toSQL from '../toSQL';
import Operator from './Operator';
import QueryValues from '../QueryValues';

export type LHS = Operator;
export type RHS = Operator;

export default class AndOperator extends Operator {
  protected readonly lhs: LHS;
  protected readonly rhs: RHS;

  constructor(lhs: LHS, rhs: RHS) {
    super();

    this.lhs = lhs;
    this.rhs = rhs;
  }

  toSQL(values: QueryValues) {
    return `(${toSQL(this.lhs, values)}) AND (${toSQL(this.rhs, values)})`;
  }
}
