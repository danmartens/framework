import TableBuilder from '../TableBuilder';

test('works', () => {
  const builder = new TableBuilder('products');

  builder.string('name');

  expect(builder.toSQL()).toEqual(`
    CREATE TABLE products (
      name varchar(255)
    );
  `);
});
