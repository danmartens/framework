import getClient from '../getClient';
import InsertQuery from '../InsertQuery';
import Table from '../Table';

jest.mock('../getClient');

const products = new Table('products', {
  id: {
    type: 'number'
  },
  name: {
    type: 'string'
  }
});

class Product extends products.Resource {}

describe('InsertQuery', () => {
  describe('#toSQL()', () => {
    test('generates SQL', () => {
      const query = new InsertQuery(Product, { name: 'New Product' });

      expect(query.toSQL().text).toEqual(
        'INSERT INTO "products" (name) VALUES($1) RETURNING *'
      );

      expect(query.toSQL().values).toEqual(['New Product']);
    });
  });

  describe('#then()', () => {
    test('wraps the results in Resource classes', async () => {
      getClient.__setNextResult({
        rows: [
          {
            id: 1,
            name: 'New Product'
          }
        ]
      });

      const result = await new InsertQuery(Product, { name: 'New Product' });

      expect(result).toBeInstanceOf(Product);

      expect(result.attributes).toEqual({
        id: 1,
        name: 'New Product'
      });
    });
  });
});
