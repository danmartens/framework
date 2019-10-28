import Column from './Column';
import EqualOperator from '../operators/EqualOperator';
import NotEqualOperator from '../operators/NotEqualOperator';
import InOperator from '../operators/InOperator';

import GreaterThanOperator, {
  RHS as GreaterThanRHS
} from '../operators/GreaterThanOperator';

import GreaterThanOrEqualToOperator, {
  RHS as GreaterThanOrEqualToRHS
} from '../operators/GreaterThanOrEqualToOperator';

import LessThanOperator, {
  RHS as LessThanRHS
} from '../operators/LessThanOperator';

import LessThanOrEqualToOperator, {
  RHS as LessThanOrEqualToRHS
} from '../operators/LessThanOrEqualToOperator';

export default class NumberColumn extends Column {
  eq(rhs: NumberColumn | number | null) {
    return new EqualOperator(this, rhs);
  }

  notEq(rhs: NumberColumn | number | null) {
    return new NotEqualOperator(this, rhs);
  }

  in(rhs: number[]) {
    return new InOperator(this, rhs);
  }

  gt(rhs: GreaterThanRHS) {
    return new GreaterThanOperator(this, rhs);
  }

  gte(rhs: GreaterThanOrEqualToRHS) {
    return new GreaterThanOrEqualToOperator(this, rhs);
  }

  lt(rhs: LessThanRHS) {
    return new LessThanOperator(this, rhs);
  }

  lte(rhs: LessThanOrEqualToRHS) {
    return new LessThanOrEqualToOperator(this, rhs);
  }
}
