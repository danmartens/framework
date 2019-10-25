import toSQL from './toSQL';
import { Operator } from './Operator';
import QueryValues from './QueryValues';

export type AndLHS = Operator;
export type AndRHS = Operator;

export default class AndOperator {
  protected readonly lhs: AndLHS;
  protected readonly rhs: AndRHS;

  constructor(lhs: AndLHS, rhs: AndRHS) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(values: QueryValues) {
    return `(${toSQL(this.lhs, values)}) AND (${toSQL(this.rhs, values)})`;
  }
}
