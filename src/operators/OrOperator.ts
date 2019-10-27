import toSQL from '../toSQL';
import Operator from './Operator';
import QueryValues from '../QueryValues';

export type OrRHS = Operator;

export default class OrOperator extends Operator {
  readonly lhs: Operator;
  readonly rhs: OrRHS;

  constructor(lhs: Operator, rhs: OrRHS) {
    super();

    this.lhs = lhs;
    this.rhs = rhs;
  }

  toSQL(values: QueryValues) {
    return `(${toSQL(this.lhs, values)}) OR (${toSQL(this.rhs, values)})`;
  }
}
