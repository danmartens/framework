import Column from './Column';
import EqualOperator from '../operators/EqualOperator';
import InOperator from '../operators/InOperator';

export default class BooleanColumn extends Column {
  eq(rhs: BooleanColumn | boolean | null) {
    return new EqualOperator(this, rhs);
  }

  in(rhs: boolean[]) {
    return new InOperator(this, rhs);
  }
}
