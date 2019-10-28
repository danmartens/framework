import InfixOperator from './InfixOperator';
import QueryValues from '../QueryValues';
import toSQL from '../toSQL';

export type RHS = string;

export default class LikeOperator extends InfixOperator<RHS> {
  toSQL(values: QueryValues) {
    return `${toSQL(this.lhs, values)} LIKE ${toSQL(this.rhs, values)}`;
  }
}
