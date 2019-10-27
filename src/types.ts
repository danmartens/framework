import Operator from './operators/Operator';
import OrderByExpression from './OrderByExpression';
import JoinClause from './JoinClause';
import Column from './columns/Column';

export type ColumnType<T> = T extends string
  ? string | string[]
  : (T extends string | null
      ? null | string | string[]
      : (T extends number
          ? number | number[]
          : (T extends number | null ? number | number[] | null : never)));

export type WhereConditions<T> = {
  [K in keyof T]?: ColumnType<T[K]>;
};

export type OrderConditions<T> = {
  [K in keyof T]?: 'ASC' | 'DESC';
};

export interface QueryOptions {
  select?: Column[];
  where?: Operator;
  join?: JoinClause[];
  orderBy?: OrderByExpression[];
  limit?: number;
  offset?: number;
}
