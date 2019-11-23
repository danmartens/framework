import express from 'express';
import graphqlHTTP from 'express-graphql';
import Table from '../Table';
import { Schema, ResourceClass, Attributes } from '../types';
import InsertQuery from '../InsertQuery';

import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

const schema: Schema.Relation = {
  id: {
    type: 'integer',
    nullable: false
  },
  name: {
    type: 'string',
    nullable: false
  }
};

const products = new Table('products', schema);

class Product extends products.Resource {}

function createMutationResolver<
  TSchema extends Schema.Relation,
  TResource extends ResourceClass<TSchema>
>(
  resourceClass: TResource
): (options: {
  input: Partial<Attributes<TSchema>>;
}) => PromiseLike<InstanceType<TResource>> {
  return ({ input }: { input: Partial<Attributes<TSchema>> }) => {
    const query = new InsertQuery(resourceClass, input);

    return query;
  };
}

export default function server() {
  const app = express();

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        hello: {
          type: GraphQLString,
          resolve() {
            return 'world';
          }
        }
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: {
        createProduct: {
          args: {
            input: {
              type: products.GraphQLInputObjectType
            }
          },
          type: products.GraphQLObjectType
        }
      }
    })
  });

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: {
        createProduct: createMutationResolver(Product)
      },
      graphiql: true
    })
  );

  app.listen(4000);
}
