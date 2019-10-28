import Operator from './operators/Operator';
import OrderByExpression from './OrderByExpression';
import JoinClause from './JoinClause';
import Column from './columns/Column';
import BaseResource from './BaseResource';
import Table from './Table';
import CountFunction from './CountFunction';

export interface TString {
  type: 'string';
  nullable: false;
}

export interface TNullableString {
  type: 'string';
  nullable: true;
}

export interface TNumber {
  type: 'number';
  nullable: false;
}

export interface TNullableNumber {
  type: 'number';
  nullable: true;
}

export interface TableSchema {
  [key: string]: TNumber | TNullableNumber | TString | TNullableString;
}

export type TableAttributes<T extends TableSchema> = {
  [K in keyof T]: T[K] extends TString
    ? string
    : (T[K] extends TNullableString
        ? string | null
        : (T[K] extends TNullableNumber
            ? number | null
            : (T[K] extends TNumber ? number : never)));
};

export interface ResourceClass<T extends TableSchema> {
  new (attributes: TableAttributes<T>): BaseResource<T>;
  table: Table<T>;
}

export type ColumnType<T> = T extends { type: 'string'; nullable: false }
  ? string | string[]
  : (T extends { type: 'string'; nullable: true }
      ? null | string | string[]
      : (T extends TNumber
          ? number | number[]
          : (T extends TNullableNumber ? number | number[] | null : never)));

export type WhereConditions<T extends TableSchema> = {
  [K in keyof T]?: ColumnType<T[K]>;
};

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
