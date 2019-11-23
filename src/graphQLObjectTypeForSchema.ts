import { GraphQLObjectType, GraphQLObjectTypeConfig } from 'graphql';
import graphQLTypeForSchemaType from './graphQLTypeForSchemaType';
import { Schema } from './types';

export default function graphQLObjectTypeForSchema(
  name: string,
  schema: Schema.Relation
) {
  const fields: GraphQLObjectTypeConfig<
    unknown,
    unknown,
    { [key: string]: unknown }
  >['fields'] = {};

  for (const [columnName, schemaType] of Object.entries(schema)) {
    fields[columnName] = {
      type: graphQLTypeForSchemaType(schemaType)
    };
  }

  return new GraphQLObjectType({
    name,
    fields
  });
}
