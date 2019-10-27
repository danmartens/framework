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
  test('where', () => {
    let query = new QueryBuilder<ProductRecord, typeof Product>(products);

    query = query
      .where({ name: 'Cool Car' })
      .orWhere({ id: null, name: 'Uncool Car' })
      .innerJoin(variants, variants.col('product_id').eq(products.col('id')))
      .limit(1)
      .offset(10);

    expect(query.toSQL()).toEqual('hello');
  });
});
