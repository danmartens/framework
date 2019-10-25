import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import generate from '@babel/generator';
import * as types from '@babel/types';
import chalk from 'chalk';

import Schema from '../schema-parser/Schema';

interface Options {
  database?: string;
}

export default async function generateTypes(options: Options) {
  // TODO: Remove the default table!
  const database = options.database || 'commerce_development';
  const sql = execSync(`pg_dump -s ${database}`);
  const schema = Schema.fromSQL(sql.toString());
  const outputPath = path.join(process.cwd(), 'records.ts');

  fs.writeFileSync(
    outputPath,
    schema.tables
      .map(
        table =>
          generate(types.exportNamedDeclaration(table.toTypeScriptType(), []))
            .code
      )
      .join('\n\n')
  );

  console.log(
    `Generated types for ${chalk.cyan(database)} in ${chalk.cyan(outputPath)}`
  );
}
