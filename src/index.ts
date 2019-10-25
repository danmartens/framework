import program from 'commander';
import generateTypes from './commands/generateTypes';

program.version(require('../package.json')['version']);

program
  .command('generate:types')
  .option('-d, --database <database>', 'database name')
  .description('Generates TypeScript types from the database')
  .action(generateTypes);

program.parse(process.argv);
