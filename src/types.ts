import Operator from './operators/Operator';
import OrderByExpression from './OrderByExpression';
import JoinClause from './JoinClause';
import Column from './columns/Column';
import BaseResource from './BaseResource';
import Table from './Table';
import CountFunction from './CountFunction';

namespace TColumn {
  export interface String {
    type: 'string';
    nullable: false;
  }

  export interface NullableString {
    type: 'string';
    nullable: true;
  }

  export interface Number {
    type: 'number';
    nullable: false;
  }

  export interface NullableNumber {
    type: 'number';
    nullable: true;
  }
}

export interface Schema {
  [key: string]:
    | TColumn.Number
    | TColumn.NullableNumber
    | TColumn.String
    | TColumn.NullableString;
}

export type Attributes<T extends Schema> = {
  [K in keyof T]: T[K] extends TColumn.String
    ? string
    : (T[K] extends TColumn.NullableString
        ? string | null
        : (T[K] extends TColumn.NullableNumber
            ? number | null
            : (T[K] extends TColumn.Number ? number : never)));
};

export interface ResourceClass<T extends Schema> {
  new (attributes: Attributes<T>): BaseResource<T>;
  table: Table<T>;
}

export type ColumnType<T> = T extends TColumn.String
  ? string | string[]
  : (T extends TColumn.NullableString
      ? null | string | string[]
      : (T extends TColumn.Number
          ? number | number[]
          : (T extends TColumn.NullableNumber
              ? number | number[] | null
              : never)));

export type WhereConditions<T extends Schema> =
  | {
      [K in keyof T]?: ColumnType<T[K]>;
    }
  | Operator
  | ((table: Table<T>) => Operator);

export type OrderConditions<T> = {
  [K in keyof T]?: 'ASC' | 'DESC';
};

export interface QueryOptions {
  select?: Array<Column | CountFunction>;
  where?: Operator;
  join?: JoinClause[];
  orderBy?: OrderByExpression[];
  limit?: number;
  offset?: number;
}
