import Operator from './Operator';
import AndOperator, { AndRHS } from './AndOperator';
import OrOperator, { OrRHS } from './OrOperator';
import Column from '../columns/Column';

export default abstract class InfixOperator<RHS> extends Operator {
  protected readonly lhs: Column;
  protected readonly rhs: RHS;

  constructor(lhs: Column, rhs: RHS) {
    super();

    this.lhs = lhs;
    this.rhs = rhs;
  }

  and(rhs: AndRHS): AndOperator {
    return new AndOperator(this, rhs);
  }

  or(rhs: OrRHS): OrOperator {
    return new OrOperator(this, rhs);
  }
}
