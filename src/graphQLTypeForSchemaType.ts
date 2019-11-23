import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';

import { Schema } from './types';

export default function graphQLTypeForSchemaValue(type: Schema.Value) {
  if (Schema.isInteger(type)) {
    return new GraphQLNonNull(GraphQLInt);
  }

  if (Schema.isNullableInteger(type)) {
    return GraphQLInt;
  }

  if (Schema.isString(type)) {
    return new GraphQLNonNull(GraphQLString);
  }

  if (Schema.isNullableString(type)) {
    return GraphQLString;
  }

  throw new Error('Unrecognized schema type');
}
