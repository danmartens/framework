import InfixOperator from './InfixOperator';
import InOperator from './InOperator';
import toSQL from './toSQL';
import Column from './Column';
import QueryValues from './QueryValues';

export type EqualRHS = Column | number | string | boolean | null;

export default class EqualOperator extends InfixOperator<EqualRHS> {
  static merge(operators: EqualOperator[]): Array<EqualOperator | InOperator> {
    const map: Map<Column, Array<EqualRHS>> = new Map();

    for (const operator of operators) {
      if (map.has(operator.lhs)) {
        map.get(operator.lhs).push(operator.rhs);
      } else {
        map.set(operator.lhs, [operator.rhs]);
      }
    }

    return [...map.entries()].map(([lhs, rhs]) => {
      if (rhs.length === 1) {
        return new EqualOperator(lhs, rhs[0]);
      } else {
        return new InOperator(lhs, rhs);
      }
    });
  }

  toString(values: QueryValues) {
    if (this.rhs === null) {
      return `${toSQL(this.lhs, values)} IS ${toSQL(this.rhs, values)}`;
    } else {
      return `${toSQL(this.lhs, values)} = ${toSQL(this.rhs, values)}`;
    }
  }
}
