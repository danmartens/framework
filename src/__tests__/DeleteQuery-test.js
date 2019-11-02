import getClient from '../getClient';
import DeleteQuery from '../DeleteQuery';
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

describe('DeleteQuery', () => {
  describe('#toSQL()', () => {
    test('generates SQL', () => {
      const query = new DeleteQuery(Product, { name: 'New Product' });

      expect(query.toSQL().text).toEqual(
        'DELETE FROM "products" WHERE "products"."name" = $1 RETURNING *'
      );

      expect(query.toSQL().values).toEqual(['New Product']);
    });
  });

  // describe('#then()', () => {
  //   test('wraps the results in Resource classes', async () => {
  //     getClient.__setNextResult({
  //       rows: [
  //         {
  //           id: 1,
  //           name: 'New Product'
  //         }
  //       ]
  //     });

  //     const result = await new DeleteQuery(Product, { name: 'New Product' });

  //     expect(result).toBeInstanceOf(Product);

  //     expect(result.attributes).toEqual({
  //       id: 1,
  //       name: 'New Product'
  //     });
  //   });
  // });
});
