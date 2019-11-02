import Table from './Table';
import Operator from './operators/Operator';
import { Schema, WhereConditions } from './types';

export default function whereConditionsToOperators<TSchema extends Schema>(
  table: Table<any>,
  conditions: WhereConditions<TSchema>
): Operator {
  let where;

  if (conditions instanceof Operator) {
    where = conditions;
  } else if (typeof conditions === 'function') {
    where = conditions(table);
  } else {
    for (const [key, value] of Object.entries(conditions)) {
      let operator;

      if (Array.isArray(value)) {
        operator = table.col(key).in(value);
      } else {
        operator = table.col(key).eq(value);
      }

      if (where == null) {
        where = operator;
      } else {
        where = where.and(operator);
      }
    }
  }

  return where;
}
