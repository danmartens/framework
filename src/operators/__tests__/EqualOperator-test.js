import Table from '../../Table';
import EqualOperator from '../EqualOperator';
import QueryValues from '../../QueryValues';

const products = new Table('products', {
  id: {
    type: 'number'
  },
  name: {
    type: 'string'
  }
});

describe('EqualOperator', () => {
  describe('#toSQL()', () => {
    test('null value', () => {
      const values = new QueryValues();

      expect(
        new EqualOperator(products.col('name'), null).toSQL(values)
      ).toEqual('"products"."name" IS NULL');

      expect(values.toArray()).toEqual([]);
    });

    test('non-null value', () => {
      const values = new QueryValues();

      expect(
        new EqualOperator(products.col('name'), 'Test Product').toSQL(values)
      ).toEqual('"products"."name" = $1');

      expect(values.toArray()).toEqual(['Test Product']);
    });
  });
});
