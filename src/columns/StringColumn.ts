import Column from './Column';
import EqualOperator from '../operators/EqualOperator';
import NotEqualOperator from '../operators/NotEqualOperator';
import InOperator from '../operators/InOperator';
import LikeOperator from '../operators/LikeOperator';

export default class StringColumn extends Column {
  eq(rhs: StringColumn | string | null) {
    return new EqualOperator(this, rhs);
  }

  notEq(rhs: StringColumn | string | null) {
    return new NotEqualOperator(this, rhs);
  }

  in(rhs: string[]) {
    return new InOperator(this, rhs);
  }

  like(rhs: string) {
    return new LikeOperator(this, rhs);
  }
}
