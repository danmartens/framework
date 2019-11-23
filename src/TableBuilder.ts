interface ColumnOptions {
  null?: boolean;
}

interface IntegerColumnOptions extends ColumnOptions {
  default?: number;
}

interface StringColumnOptions extends ColumnOptions {
  default?: string;
}

export default class TableBuilder {
  readonly tableName: string;
  protected columns: object[];

  constructor(tableName: string) {
    this.tableName = tableName;
    this.columns = [];
  }

  integer(columnName: string, options: IntegerColumnOptions = {}) {
    this.columns.push({
      columnName,
      ...options
    });
  }

  string(columnName: string, options: StringColumnOptions = {}) {
    this.columns.push({
      columnName,
      ...options
    });
  }

  toSQL() {
    return '';
  }
}
