import generate from '@babel/generator';

import Column from '../Column';

describe('Column', () => {
  const typeScriptTypeFromSQL = (sql: string) =>
    generate(Column.fromSQL(sql).toTypeScriptType()).code;

  const graphQLTypeFromSQL = (sql: string) =>
    generate(Column.fromSQL(sql).toGraphQLType()).code;

  describe('toTypeScriptType', () => {
    test('character(n) -> string | null', () => {
      expect(typeScriptTypeFromSQL('column character(5)')).toEqual(
        'string | null'
      );
    });

    test('char(n) -> string | null', () => {
      expect(typeScriptTypeFromSQL('column char(5)')).toEqual('string | null');
    });

    test('character varying(n) -> string | null', () => {
      expect(typeScriptTypeFromSQL('column character varying(n)')).toEqual(
        'string | null'
      );
    });

    test('varchar(n) -> string | null', () => {
      expect(typeScriptTypeFromSQL('column varchar(5)')).toEqual(
        'string | null'
      );
    });

    test('text -> string | null', () => {
      expect(typeScriptTypeFromSQL('column text')).toEqual('string | null');
    });

    test('public.citext -> string | null', () => {
      expect(typeScriptTypeFromSQL('column public.citext')).toEqual(
        'string | null'
      );
    });

    test('uuid -> string | null', () => {
      expect(typeScriptTypeFromSQL('column uuid')).toEqual('string | null');
    });

    test('integer -> number | null', () => {
      expect(typeScriptTypeFromSQL('column integer')).toEqual('number | null');
    });

    test('integer NOT NULL -> number', () => {
      expect(typeScriptTypeFromSQL('column integer NOT NULL')).toEqual(
        'number'
      );
    });

    test('integer[] NOT NULL -> number', () => {
      expect(typeScriptTypeFromSQL('column integer[] NOT NULL')).toEqual(
        'number[]'
      );
    });

    test('boolean NOT NULL -> boolean', () => {
      expect(typeScriptTypeFromSQL('column boolean NOT NULL')).toEqual(
        'boolean'
      );
    });

    test('date NOT NULL -> Date', () => {
      expect(typeScriptTypeFromSQL('column date NOT NULL')).toEqual('Date');
    });

    test('date NOT NULL -> Date', () => {
      expect(typeScriptTypeFromSQL('column date NOT NULL')).toEqual('Date');
    });

    test('timestamp NOT NULL -> Date', () => {
      expect(typeScriptTypeFromSQL('column timestamp NOT NULL')).toEqual(
        'Date'
      );
    });

    test('timestamp without timezone NOT NULL -> Date', () => {
      expect(
        typeScriptTypeFromSQL('column timestamp without timezone NOT NULL')
      ).toEqual('Date');
    });

    test('timestamp with timezone NOT NULL -> Date', () => {
      expect(
        typeScriptTypeFromSQL('column timestamp with timezone NOT NULL')
      ).toEqual('Date');
    });
  });

  describe('toGraphQLType', () => {
    test('string', () => {
      expect(graphQLTypeFromSQL('column text NOT NULL')).toEqual(
        'new GraphQLNonNull(GraphQLString)'
      );
    });

    test('optional string', () => {
      expect(
        graphQLTypeFromSQL('code char(5) CONSTRAINT firstkey PRIMARY KEY')
      ).toEqual('GraphQLString');
    });

    test('boolean', () => {
      expect(graphQLTypeFromSQL('column boolean NOT NULL')).toEqual(
        'new GraphQLNonNull(GraphQLBoolean)'
      );
    });

    test('optional boolean', () => {
      expect(graphQLTypeFromSQL('column boolean')).toEqual('GraphQLBoolean');
    });

    test('integer', () => {
      expect(graphQLTypeFromSQL('column integer NOT NULL')).toEqual(
        'new GraphQLNonNull(GraphQLInteger)'
      );
    });

    test('optional integer', () => {
      expect(graphQLTypeFromSQL('column integer')).toEqual('GraphQLInteger');
    });

    test('float', () => {
      expect(graphQLTypeFromSQL('column decimal NOT NULL')).toEqual(
        'new GraphQLNonNull(GraphQLFloat)'
      );
    });

    test('optional float', () => {
      expect(graphQLTypeFromSQL('column decimal')).toEqual('GraphQLFloat');
    });
  });
});
