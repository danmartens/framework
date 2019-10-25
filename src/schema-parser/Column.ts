import * as types from '@babel/types';
import camelCase from 'lodash/camelCase';

import mapColumnType from './mapColumnType';
import { ColumnType } from './types';

export default class Column {
  static fromSQL(sql: string): Column {
    const parts = /^\s*"?([a-z0-9_]+)"?\s+([a-z0-9()\.]+)(\(\d+(,\d+)?\))?(\[\])?(\s+(.+))?,?$/i.exec(
      sql
    );

    if (parts == null) {
      throw new Error(`Failed to parse \`${sql}\` into Column`);
    }

    const name = parts[1];
    const type = mapColumnType(parts[2]);
    const array = parts[5] === '[]';
    const required = /not\s+null/i.test(parts[6]);

    return new Column(name, type, array, required);
  }

  readonly name: string;
  readonly type: ColumnType;
  readonly array: boolean;
  readonly required: boolean;

  constructor(
    name: string,
    type: ColumnType,
    array: boolean,
    required: boolean
  ) {
    this.name = name;
    this.type = type;
    this.array = array;
    this.required = required;
  }

  get normalizedName() {
    return camelCase(this.name);
  }

  toTypeScriptType() {
    let typeScriptType: types.TSType = {
      boolean: types.tsBooleanKeyword(),
      integer: types.tsNumberKeyword(),
      float: types.tsNumberKeyword(),
      string: types.tsStringKeyword(),
      date: types.tsTypeReference(types.identifier('Date'))
    }[this.type];

    if (this.array) {
      typeScriptType = types.tsArrayType(typeScriptType);
    }

    if (this.required) {
      return typeScriptType;
    } else {
      return types.tsUnionType([typeScriptType, types.tsNullKeyword()]);
    }
  }

  toGraphQLType() {
    const graphQLType = {
      boolean: types.identifier('GraphQLBoolean'),
      integer: types.identifier('GraphQLInteger'),
      float: types.identifier('GraphQLFloat'),
      string: types.identifier('GraphQLString'),
      date: types.identifier('GraphQLString')
    }[this.type];

    if (this.required) {
      return types.newExpression(types.identifier('GraphQLNonNull'), [
        graphQLType
      ]);
    } else {
      return graphQLType;
    }
  }
}
