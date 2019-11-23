import Column from './columns/Column';
import StringColumn from './columns/StringColumn';
import NumberColumn from './columns/NumberColumn';
import BaseResource from './BaseResource';
import graphQLObjectTypeForSchema from './graphQLObjectTypeForSchema';
import { Schema } from './types';

interface ColumnType {
  string: typeof StringColumn;
  integer: typeof NumberColumn;
}

const types: ColumnType = {
  string: StringColumn,
  integer: NumberColumn
};

export default class Table<TSchema extends Schema> {
  readonly name: string;
  readonly schema: TSchema;

  constructor(name: string, schema: TSchema) {
    this.name = name;
    this.schema = schema;
  }

  col<K extends keyof TSchema>(
    name: K
  ): InstanceType<ColumnType[TSchema[K]['type']]> {
    const columnClass = types[this.schema[name]['type']];

    return new columnClass(this, name as string) as InstanceType<
      ColumnType[TSchema[K]['type']]
    >;
  }

  all(): Column {
    return new Column(this, '*');
  }

  toSQL() {
    return `"${this.name}"`;
  }

  get Resource() {
    const table = this;

    abstract class Resource extends BaseResource<TSchema> {
      static readonly table = table;
    }

    return Resource;
  }

  get GraphQLObjectType() {
    return graphQLObjectTypeForSchema(this.name, this.schema);
  }

  // get GraphQLInputObjectType(): GraphQLInputObjectType {
  //   const fields: {
  //     [key: string]: { type: ReturnType<typeof graphQLTypeForSchemaType> };
  //   } = {};

  //   for (const [columnName, schemaType] of Object.entries(this.schema)) {
  //     fields[columnName] = {
  //       type: graphQLTypeForSchemaType(schemaType)
  //     };
  //   }

  //   return new GraphQLInputObjectType({
  //     name: `${this.name}Input`,
  //     fields
  //   });
  // }
}
