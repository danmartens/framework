import knex from 'knex';

export default knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    database: 'commerce_development'
  }
});
