import Table from '../../Table';
import LikeOperator from '../LikeOperator';
import QueryValues from '../../QueryValues';

const products = new Table('products', {
  id: {
    type: 'number'
  },
  name: {
    type: 'string'
  }
});

describe('LikeOperator', () => {
  describe('#toSQL()', () => {
    test('non-null value', () => {
      const values = new QueryValues();

      expect(
        new LikeOperator(products.col('name'), '%Test Product%').toSQL(values)
      ).toEqual('"products"."name" LIKE $1');

      expect(values.toArray()).toEqual(['%Test Product%']);
    });
  });
});
