import * as types from '@babel/types';
import camelCase from 'lodash/camelCase';

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

  get normalizedName() {
    let normalizedName = camelCase(this.name);

    return normalizedName[0].toUpperCase() + normalizedName.substr(1);
  }

  toTypeScriptType() {
    return types.tsInterfaceDeclaration(
      types.identifier(`${this.normalizedName}Record`),
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

  toResourceClass() {
    const declaration = types.classDeclaration(
      types.identifier(this.normalizedName),
      types.identifier('Resource'),
      types.classBody(
        this.columns.map(column =>
          types.classMethod(
            'get',
            types.identifier(column.normalizedName),
            [],
            types.blockStatement([
              types.returnStatement(
                types.memberExpression(
                  types.memberExpression(
                    types.identifier('this'),
                    types.identifier('attributes')
                  ),
                  types.identifier(column.name)
                )
              )
            ])
          )
        )
      )
    );

    declaration.superTypeParameters = types.tsTypeParameterInstantiation([
      types.tsTypeReference(types.identifier(`${this.normalizedName}Record`))
    ]);

    return declaration;
  }
}
