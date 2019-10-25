import AndOperator from './AndOperator';
import OrOperator from './OrOperator';
import EqualOperator from './EqualOperator';
import InOperator from './InOperator';
import GreaterThanOperator from './GreaterThanOperator';
import InfixOperator from './InfixOperator';

export type Operator =
  | InfixOperator<any>
  | EqualOperator
  | GreaterThanOperator
  | AndOperator
  | OrOperator
  | InOperator;
