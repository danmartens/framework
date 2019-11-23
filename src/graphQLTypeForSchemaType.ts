import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';

import {
  SchemaType,
  isInteger,
  isNullableInteger,
  isString,
  isNullableString
} from './types';

export default function graphQLTypeForSchemaType(type: SchemaType) {
  if (isInteger(type)) {
    return new GraphQLNonNull(GraphQLInt);
  }

  if (isNullableInteger(type)) {
    return GraphQLInt;
  }

  if (isString(type)) {
    return new GraphQLNonNull(GraphQLString);
  }

  if (isNullableString(type)) {
    return GraphQLString;
  }

  throw new Error('Unrecognized schema type');
}
