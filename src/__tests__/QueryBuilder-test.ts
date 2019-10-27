import QueryBuilder from '../QueryBuilder';
import Table from '../Table';
import Resource from '../Resource';

interface ProductRecord {
  id: number;
  name: string;
}

class Product extends Resource<ProductRecord> {}

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

describe('QueryBuilder', () => {
  test('selecting all columns', () => {
    let query = new QueryBuilder<ProductRecord, typeof Product>(products);

    expect(query.toSQL().text).toEqual('SELECT "products".* FROM "products"');
  });

  test('selecting specific columns', () => {
    let query = new QueryBuilder<ProductRecord, typeof Product>(products);

    query = query.select('id', 'name');

    expect(query.toSQL().text).toEqual(
      'SELECT "products"."id", "products"."name" FROM "products"'
    );
  });

  test('selecting columns from other tables', () => {
    let query = new QueryBuilder<ProductRecord, typeof Product>(products);

    query = query.select('id', variants.col('id'));

    expect(query.toSQL().text).toEqual(
      'SELECT "products"."id", "variants"."id" FROM "products", "variants"'
    );
  });

  test('aliasing columns', () => {
    let query = new QueryBuilder<ProductRecord, typeof Product>(products);

    query = query.select(products.col('id').as('product_id'));

    expect(query.toSQL().text).toEqual(
      'SELECT "products"."id" AS "product_id" FROM "products"'
    );
  });

  describe('#where()', () => {
    test('object where conditions', () => {
      let query = new QueryBuilder<ProductRecord, typeof Product>(products);

      query = query.where({ name: 'Test Product' });

      expect(query.toSQL().text).toEqual(
        'SELECT "products".* FROM "products" WHERE "products"."name" = $1'
      );

      expect(query.toSQL().values).toEqual(['Test Product']);
    });

    test('operator where conditions', () => {
      let query = new QueryBuilder<ProductRecord, typeof Product>(products);

      query = query.where(products.col('name').eq('Test Product'));

      expect(query.toSQL().text).toEqual(
        'SELECT "products".* FROM "products" WHERE "products"."name" = $1'
      );

      expect(query.toSQL().values).toEqual(['Test Product']);
    });
  });

  describe('#orWhere()', () => {
    test('object where conditions', () => {
      let query = new QueryBuilder<ProductRecord, typeof Product>(products);

      query = query.where({ name: 'Jacket' }).orWhere({ name: 'Coat' });

      expect(query.toSQL().text).toEqual(
        'SELECT "products".* FROM "products" WHERE ("products"."name" = $1) OR ("products"."name" = $2)'
      );

      expect(query.toSQL().values).toEqual(['Jacket', 'Coat']);
    });

    test('operator where conditions', () => {
      let query = new QueryBuilder<ProductRecord, typeof Product>(products);

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
