import AndOperator, { AndRHS } from './AndOperator';
import OrOperator, { OrRHS } from './OrOperator';
import Column from './Column';

export default abstract class InfixOperator<RHS> {
  protected readonly lhs: Column;
  protected readonly rhs: RHS;

  constructor(lhs: Column, rhs: RHS) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  and(rhs: AndRHS) {
    return new AndOperator(this, rhs);
  }

  or(rhs: OrRHS) {
    return new OrOperator(this, rhs);
  }
}
