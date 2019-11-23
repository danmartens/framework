import toSQL from '../toSQL';
import Operator from './Operator';
import AndOperator, { RHS as AndRHS } from './AndOperator';
import QueryValues from '../QueryValues';

export type RHS = Operator;

export default class OrOperator extends Operator {
  readonly lhs: Operator;
  readonly rhs: RHS;

  constructor(lhs: Operator, rhs: RHS) {
    super();

    this.lhs = lhs;
    this.rhs = rhs;
  }

  and(rhs: AndRHS): AndOperator {
    return new AndOperator(this, rhs);
  }

  or(rhs: RHS): OrOperator {
    return new OrOperator(this, rhs);
  }

  toSQL(values: QueryValues) {
    return `(${toSQL(this.lhs, values)}) OR (${toSQL(this.rhs, values)})`;
  }
}
