import Operator from './operators/Operator';
import OrderByExpression from './OrderByExpression';
import JoinClause from './JoinClause';
import Column from './columns/Column';
import BaseResource from './BaseResource';
import Table from './Table';
import CountFunction from './CountFunction';

export interface SchemaString {
  type: 'string';
  nullable: false;
}

export interface SchemaNullableString {
  type: 'string';
  nullable: true;
}

export interface SchemaInteger {
  type: 'integer';
  nullable: false;
}

export interface SchemaNullableInteger {
  type: 'integer';
  nullable: true;
}

export type SchemaType =
  | SchemaString
  | SchemaNullableString
  | SchemaInteger
  | SchemaNullableInteger;

export function isInteger(value: {
  type: string;
  nullable: boolean;
}): value is SchemaInteger {
  return value.type === 'integer' && value.nullable === false;
}

export function isNullableInteger(value: {
  type: string;
  nullable: boolean;
}): value is SchemaNullableInteger {
  return value.type === 'integer' && value.nullable === true;
}

export function isString(value: {
  type: string;
  nullable: boolean;
}): value is SchemaString {
  return value.type === 'string' && value.nullable === false;
}

export function isNullableString(value: {
  type: string;
  nullable: boolean;
}): value is SchemaNullableString {
  return value.type === 'string' && value.nullable === true;
}

export interface Schema {
  [key: string]: SchemaType;
}

export type Attributes<T extends Schema> = {
  [K in keyof T]: T[K] extends SchemaString
    ? string
    : T[K] extends SchemaNullableString
    ? string | null
    : T[K] extends SchemaNullableInteger
    ? number | null
    : T[K] extends SchemaInteger
    ? number
    : never;
};

export interface ResourceClass<T extends Schema> {
  new (attributes: Attributes<T>): BaseResource<T>;
  table: Table<T>;
}

export type ColumnType<T> = T extends SchemaString
  ? string | string[]
  : T extends SchemaNullableString
  ? null | string | string[]
  : T extends SchemaInteger
  ? number | number[]
  : T extends SchemaNullableInteger
  ? number | number[] | null
  : never;

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
