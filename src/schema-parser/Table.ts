import * as types from '@babel/types';
import camelCase from 'lodash/camelCase';
import capitalize from 'lodash/capitalize';

import Column from './Column';

export default class Table {
  static fromSQL(name: string, sql: string) {
    return new Table(name, sql.split('\n').map(line => Column.fromSQL(line)));
  }

  readonly name: string;
  readonly columns: Column[];

  constructor(name: string, columns: Column[]) {
    this.name = name;
    this.columns = columns;
  }

  toTypeScriptType() {
    let interfaceName = camelCase(this.name);

    interfaceName = interfaceName[0].toUpperCase() + interfaceName.substr(1);

    return types.tsInterfaceDeclaration(
      types.identifier(interfaceName),
      null,
      null,
      types.tsInterfaceBody(
        this.columns.map(column =>
          types.tsPropertySignature(
            types.identifier(column.name),
            types.tsTypeAnnotation(column.toTypeScriptType())
          )
        )
      )
    );
  }

  toGraphQLType() {
    return types.newExpression(types.identifier('GraphQLObjectType'), [
      types.objectExpression([
        types.objectProperty(
          types.identifier('name'),
          types.stringLiteral('Name')
        ),
        types.objectProperty(
          types.identifier('fields'),
          types.objectExpression(
            this.columns.map(column =>
              types.objectProperty(
                types.identifier(column.name),
                types.objectExpression([
                  types.objectProperty(
                    types.identifier('type'),
                    column.toGraphQLType()
                  )
                ])
              )
            )
          )
        )
      ])
    ]);
  }
}
