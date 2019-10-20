import Table from './Table';

export default class Schema {
  static fromSQL(sql: string) {
    const tokens = sql.split(/[\s\r]+/);
    const tables = [];

    let tableName: string | undefined;
    let tableColumnsTokens = [];
    let createTable = false;
    let createTableArgs = false;

    for (const token of tokens) {
      if (token === ');') {
        createTableArgs = false;
        createTable = false;

        if (tableName == null) {
          throw new Error('Failed to determine table name');
        }

        const tableColumnsSQL = tableColumnsTokens
          .join(' ')
          .split(', ')
          .join(',\n');

        tables.push(Table.fromSQL(tableName, tableColumnsSQL));

        tableColumnsTokens = [];
      }

      if (createTableArgs) {
        tableColumnsTokens.push(token);
      }

      if (token === '(' && createTable) {
        createTableArgs = true;
      }

      if (createTable && !createTableArgs && token.startsWith('public.')) {
        tableName = token.split('.')[1];
      }

      if (token === 'CREATE') {
        createTable = true;
      }
    }

    return new Schema(tables);
  }

  readonly tables: Table[];

  constructor(tables: Table[]) {
    this.tables = tables;
  }
}
