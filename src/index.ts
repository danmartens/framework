import program from 'commander';
import generateTypes from './commands/generateTypes';
import server from './commands/server';

program.version(require('../package.json')['version']);

program
  .command('generate:types')
  .option('-d, --database <database>', 'database name')
  .description('Generates TypeScript types from the database')
  .action(generateTypes);

program.command('server').action(server);

program.parse(process.argv);
