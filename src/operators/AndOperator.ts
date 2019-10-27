import toSQL from '../toSQL';
import Operator from './Operator';
import QueryValues from '../QueryValues';

export type AndLHS = Operator;
export type AndRHS = Operator;

export default class AndOperator extends Operator {
  protected readonly lhs: AndLHS;
  protected readonly rhs: AndRHS;

  constructor(lhs: AndLHS, rhs: AndRHS) {
    super();

    this.lhs = lhs;
    this.rhs = rhs;
  }

  toSQL(values: QueryValues) {
    return `(${toSQL(this.lhs, values)}) AND (${toSQL(this.rhs, values)})`;
  }
}
