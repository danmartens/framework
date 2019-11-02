import getClient from '../getClient';
import UpdateQuery from '../UpdateQuery';
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

describe('UpdateQuery', () => {
  describe('#toSQL()', () => {
    test('generates SQL', () => {
      const query = new UpdateQuery(
        Product,
        { name: 'New Product' },
        { name: 'Updated Product' }
      );

      expect(query.toSQL().text).toEqual(
        'UPDATE "products" SET "name" = $1 WHERE "products"."name" = $2 RETURNING *'
      );

      expect(query.toSQL().values).toEqual(['Updated Product', 'New Product']);
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

  //     const result = await new UpdateQuery(Product, { name: 'New Product' });

  //     expect(result).toBeInstanceOf(Product);

  //     expect(result.attributes).toEqual({
  //       id: 1,
  //       name: 'New Product'
  //     });
  //   });
  // });
});
