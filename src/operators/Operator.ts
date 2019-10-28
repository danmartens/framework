import AndOperator, { RHS as AndRHS } from './AndOperator';
import OrOperator, { RHS as OrRHS } from './OrOperator';
import QueryValues from '../QueryValues';

export default abstract class Operator {
  abstract and(rhs: AndRHS): AndOperator;
  abstract or(rhs: OrRHS): OrOperator;
  abstract toSQL(values: QueryValues): string;
}
