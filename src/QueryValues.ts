export type ValuePosition = number;

export default class QueryValues {
  protected readonly values: Array<string | number> = [];

  constructor(...values: Array<string | number>) {
    this.values = values;
  }

  add(value: string | number): ValuePosition {
    this.values.push(value);

    return this.values.length;
  }

  toString() {
    return `VALUES(${this.values
      .map((_, index) => `$${index + 1}`)
      .join(', ')})`;
  }

  toArray() {
    return this.values;
  }
}
