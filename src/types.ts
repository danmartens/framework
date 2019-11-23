import Operator from './operators/Operator';
import OrderByExpression from './OrderByExpression';
import JoinClause from './JoinClause';
import Column from './columns/Column';
import BaseResource from './BaseResource';
import Table from './Table';
import CountFunction from './CountFunction';

export namespace Schema {
  export interface String {
    type: 'string';
    nullable: false;
  }

  export function isString(value: {
    type: string;
    nullable: boolean;
  }): value is String {
    return value.type === 'string' && value.nullable === false;
  }

  export interface NullableString {
    type: 'string';
    nullable: true;
  }

  export function isNullableString(value: {
    type: string;
    nullable: boolean;
  }): value is NullableString {
    return value.type === 'string' && value.nullable === true;
  }

  export interface Integer {
    type: 'integer';
    nullable: false;
  }

  export function isInteger(value: {
    type: string;
    nullable: boolean;
  }): value is Integer {
    return value.type === 'integer' && value.nullable === false;
  }

  export interface NullableInteger {
    type: 'integer';
    nullable: true;
  }

  export function isNullableInteger(value: {
    type: string;
    nullable: boolean;
  }): value is NullableInteger {
    return value.type === 'integer' && value.nullable === true;
  }

  export type Value = String | NullableString | Integer | NullableInteger;

  export interface Relation {
    [key: string]: Value;
  }
}

export type Attributes<T extends Schema.Relation> = {
  [K in keyof T]: T[K] extends Schema.String
    ? string
    : T[K] extends Schema.NullableString
    ? string | null
    : T[K] extends Schema.NullableInteger
    ? number | null
    : T[K] extends Schema.Integer
    ? number
    : never;
};

export interface ResourceClass<T extends Schema.Relation> {
  new (attributes: Attributes<T>): BaseResource<T>;
  table: Table<T>;
}

export type ColumnType<T> = T extends Schema.String
  ? string | string[]
  : T extends Schema.NullableString
  ? null | string | string[]
  : T extends Schema.Integer
  ? number | number[]
  : T extends Schema.NullableInteger
  ? number | number[] | null
  : never;

export type WhereConditions<T extends Schema.Relation> =
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
