import toSQL from './toSQL';
import { Operator } from './Operator';
import QueryValues from './QueryValues';

export type OrRHS = Operator;

export default class OrOperator {
  readonly lhs: Operator;
  readonly rhs: OrRHS;

  constructor(lhs: Operator, rhs: OrRHS) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(values: QueryValues) {
    return `(${toSQL(this.lhs, values)}) OR (${toSQL(this.rhs, values)})`;
  }
}
