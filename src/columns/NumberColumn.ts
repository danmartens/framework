import Column from './Column';
import EqualOperator from '../operators/EqualOperator';
import InOperator from '../operators/InOperator';

export default class NumberColumn extends Column {
  eq(rhs: NumberColumn | number | null) {
    return new EqualOperator(this, rhs);
  }

  in(rhs: string[]) {
    return new InOperator(this, rhs);
  }
}
