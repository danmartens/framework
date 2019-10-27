import Column from './columns/Column';

export default class OrderByExpression {
  protected readonly column: Column;
  protected readonly direction: 'ASC' | 'DESC';

  constructor(column: Column, direction: 'ASC' | 'DESC') {
    this.column = column;
    this.direction = direction;
  }

  toSQL() {
    return `${this.column.toString()} ${this.direction}`;
  }
}
