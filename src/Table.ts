import StringColumn from './StringColumn';
import NumberColumn from './NumberColumn';

interface ColumnType {
  string: typeof StringColumn;
  number: typeof NumberColumn;
}

const types: ColumnType = {
  string: StringColumn,
  number: NumberColumn
};

export default class Table<
  TSchema extends { [key: string]: { type: 'string' | 'number' } }
> {
  readonly name: string;
  readonly schema: TSchema;

  constructor(name: string, schema: TSchema) {
    this.name = name;
    this.schema = schema;
  }

  col<K extends keyof TSchema>(
    name: K
  ): InstanceType<ColumnType[TSchema[K]['type']]> {
    const columnClass = types[this.schema[name]['type']];

    return new columnClass(this, name as string) as InstanceType<
      ColumnType[TSchema[K]['type']]
    >;
  }
}
