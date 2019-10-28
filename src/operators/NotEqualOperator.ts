import InfixOperator from './InfixOperator';
import toSQL from '../toSQL';
import Column from '../columns/Column';
import QueryValues from '../QueryValues';

export type RHS = Column | number | string | boolean | null;

export default class NotEqualOperator extends InfixOperator<RHS> {
  toSQL(values: QueryValues) {
    if (this.rhs === null) {
      return `${toSQL(this.lhs, values)} IS NOT ${toSQL(this.rhs, values)}`;
    } else {
      return `${toSQL(this.lhs, values)} <> ${toSQL(this.rhs, values)}`;
    }
  }
}
