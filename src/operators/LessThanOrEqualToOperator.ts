import InfixOperator from './InfixOperator';
import toSQL from '../toSQL';
import Column from '../columns/Column';
import QueryValues from '../QueryValues';

export type RHS = Column | number;

export default class LessThanOrEqualToOperator extends InfixOperator<RHS> {
  toSQL(values: QueryValues) {
    return `${toSQL(this.lhs, values)} >= ${toSQL(this.rhs, values)}`;
  }
}
