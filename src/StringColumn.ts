import Column from './Column';
import EqualOperator from './EqualOperator';
import InOperator from './InOperator';

export default class StringColumn extends Column {
  eq(rhs: StringColumn | string | null) {
    return new EqualOperator(this, rhs);
  }

  in(rhs: string[]) {
    return new InOperator(this, rhs);
  }
}
