import InfixOperator from './InfixOperator';
import toSQL from '../toSQL';
import QueryValues from '../QueryValues';

export type InRHS = Array<number | string | boolean>;

export default class InOperator extends InfixOperator<InRHS> {
  toSQL(values: QueryValues) {
    return `${toSQL(this.lhs, values)} IN ${toSQL(this.rhs, values)}`;
  }
}
