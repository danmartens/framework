import getClient from '../getClient';
import ResourceQueryBuilder from '../ResourceQueryBuilder';
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

const variants = new Table('variants', {
  id: {
    type: 'number'
  },
  product_id: {
    type: 'number'
  }
});

class Product extends products.Resource {}

const productsQuery = new ResourceQueryBuilder(Product);

class Variant extends variants.Resource {
  async product() {
    return productsQuery.find(this.attributes.product_id);
  }
}

describe('ResourceQueryBuilder', () => {
  describe('#then()', () => {
    test('wraps the results in Resource classes', async () => {
      getClient.__setNextResult({
        rows: [
          {
            id: 1,
            name: 'Product'
          }
        ]
      });

      const result = await new ResourceQueryBuilder(Product);

      expect(result[0]).toBeInstanceOf(Product);

      expect(result[0].attributes).toEqual({
        id: 1,
        name: 'Product'
      });
    });
  });

  describe('#find()', () => {
    test('uses DataLoader to merge queries', async () => {
      getClient.__setNextResult({
        rows: [
          {
            id: 2,
            name: 'Product 2'
          },
          {
            id: 1,
            name: 'Product 1'
          }
        ]
      });

      const variant1 = new Variant({ id: 1, product_id: 1 });
      const variant2 = new Variant({ id: 2, product_id: 2 });

      const results = await Promise.all([
        variant1.product(),
        variant2.product()
      ]);

      expect(results[0]).toBeInstanceOf(Product);

      expect(results[0].attributes).toEqual({
        id: 1,
        name: 'Product 1'
      });

      expect(results[1]).toBeInstanceOf(Product);

      expect(results[1].attributes).toEqual({
        id: 2,
        name: 'Product 2'
      });
    });
  });

  describe('#select()', () => {
    test('selecting all columns', () => {
      let query = new ResourceQueryBuilder(Product);

      expect(query.toSQL().text).toEqual('SELECT "products".* FROM "products"');
    });

    test('selecting specific columns', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.select('id', 'name');

      expect(query.toSQL().text).toEqual(
        'SELECT "products"."id", "products"."name" FROM "products"'
      );
    });

    test('selecting columns from other tables', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.select('id', variants.col('id'));

      expect(query.toSQL().text).toEqual(
        'SELECT "products"."id", "variants"."id" FROM "products", "variants"'
      );
    });

    test('aliasing columns', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.select(products.col('id').as('product_id'));

      expect(query.toSQL().text).toEqual(
        'SELECT "products"."id" AS "product_id" FROM "products"'
      );
    });

    test('selecting count', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.select(products.col('id').count('products_count'));

      expect(query.toSQL().text).toEqual(
        'SELECT COUNT("products"."id") AS products_count FROM "products"'
      );
    });

    test('results are returned as plain objects', async () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.select('id');

      getClient.__setNextResult({
        rows: [
          {
            id: 1
          },
          {
            id: 2
          }
        ]
      });

      const results = await query;

      expect(results[0].id).toEqual(1);
      expect(results[1].id).toEqual(2);

      expect(results[0]).not.toBeInstanceOf(Product);
      expect(results[1]).not.toBeInstanceOf(Product);
    });
  });

  describe('#where()', () => {
    test('object where conditions', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.where({ name: 'Test Product' });

      expect(query.toSQL().text).toEqual(
        'SELECT "products".* FROM "products" WHERE "products"."name" = $1'
      );

      expect(query.toSQL().values).toEqual(['Test Product']);
    });

    test('operator where conditions', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.where(products.col('name').eq('Test Product'));

      expect(query.toSQL().text).toEqual(
        'SELECT "products".* FROM "products" WHERE "products"."name" = $1'
      );

      expect(query.toSQL().values).toEqual(['Test Product']);
    });
  });

  describe('#orWhere()', () => {
    test('object where conditions', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query.where({ name: 'Jacket' }).orWhere({ name: 'Coat' });

      expect(query.toSQL().text).toEqual(
        'SELECT "products".* FROM "products" WHERE ("products"."name" = $1) OR ("products"."name" = $2)'
      );

      expect(query.toSQL().values).toEqual(['Jacket', 'Coat']);
    });

    test('operator where conditions', () => {
      let query = new ResourceQueryBuilder(Product);

      query = query
        .where({ name: 'Jacket' })
        .orWhere(products.col('name').eq('Coat'));

      expect(query.toSQL().text).toEqual(
        'SELECT "products".* FROM "products" WHERE ("products"."name" = $1) OR ("products"."name" = $2)'
      );

      expect(query.toSQL().values).toEqual(['Jacket', 'Coat']);
    });
  });
});
