import { Operator } from './Operator';
import Table from './Table';
import Column from './Column';
import QueryValues from './QueryValues';

export default function toSQL(
  value:
    | Operator
    | Table<any>
    | Column
    | number
    | string
    | boolean
    | null
    | Array<number | string | boolean>,
  values: QueryValues
): string {
  if (typeof value === 'string') {
    return `$${values.add(value)}`;
  }

  if (typeof value === 'boolean') {
    return value ? "'t'" : "'f'";
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (value === null) {
    return 'NULL';
  }

  if (Array.isArray(value)) {
    return `(${value.map(v => toSQL(v, values)).join(', ')})`;
  }

  return value.toString(values);
}
