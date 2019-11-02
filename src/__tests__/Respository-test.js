import Respository from '../Repository';
import Table from '../Table';
import getClient from '../getClient';

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

class ProductsRepository extends Respository {
  resourceClass = Product;
}

describe('Repository', () => {
  test('#insert()', async () => {
    getClient.__setNextResult({
      rows: [
        {
          id: 1,
          name: 'New Product'
        }
      ]
    });

    const productsRepo = new ProductsRepository();

    const subscriber = {
      next: jest.fn()
    };

    const subscription = productsRepo.subscribe(subscriber);

    const resource = await productsRepo.insert({ name: 'New Product' });

    subscription.unsubscribe();

    expect(subscriber.next).toHaveBeenCalledWith({
      type: 'INSERT',
      resources: [resource]
    });
  });

  test('#update()', async () => {
    getClient.__setNextResult({
      rows: [
        {
          id: 1,
          name: 'New Product'
        }
      ]
    });

    const productsRepo = new ProductsRepository();

    const subscriber = {
      next: jest.fn()
    };

    const subscription = productsRepo.subscribe(subscriber);

    const resources = await productsRepo.update(
      { name: 'New Product' },
      { name: 'Updated Product' }
    );

    subscription.unsubscribe();

    expect(subscriber.next).toHaveBeenCalledWith({
      type: 'UPDATE',
      resources
    });
  });

  describe('#delete()', () => {
    test('broadcasts an action', async () => {
      getClient.__setNextResult({
        rows: [
          {
            id: 1,
            name: 'New Product'
          }
        ]
      });

      const productsRepo = new ProductsRepository();

      const subscriber = {
        next: jest.fn()
      };

      const subscription = productsRepo.subscribe(subscriber);

      const resources = await productsRepo.delete({ name: 'New Product' });

      subscription.unsubscribe();

      expect(subscriber.next).toHaveBeenCalledWith({
        type: 'DELETE',
        resources
      });
    });
  });
});
