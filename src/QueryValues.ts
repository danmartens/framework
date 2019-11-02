export type ValuePosition = number;

export default class QueryValues {
  protected readonly values: Array<string | number | undefined>;

  constructor(...values: Array<string | number | undefined>) {
    this.values = values;
  }

  add(value: string | number | undefined): ValuePosition {
    this.values.push(value);

    return this.values.length;
  }

  toSQL() {
    if (this.values.length === 0) {
      return;
    }

    return `VALUES(${this.values
      .map((_, index) => `$${index + 1}`)
      .join(', ')})`;
  }

  toArray() {
    return this.values;
  }
}
