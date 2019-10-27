import InfixOperator from './InfixOperator';
import toSQL from '../toSQL';
import Column from '../columns/Column';
import QueryValues from '../QueryValues';

export type GreaterThanRHS = Column | number;

export default class GreaterThanOperator extends InfixOperator<GreaterThanRHS> {
  toSQL(values: QueryValues) {
    return `${toSQL(this.lhs, values)} > ${toSQL(this.rhs, values)}`;
  }
}
