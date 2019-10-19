import DataLoader from 'dataloader';

import database from './database';

import Resource from './Resource';

export default abstract class Repository<
  TRecord extends { id: TPrimaryKey },
  TResource extends new (attributes: TRecord) => Resource<TRecord>,
  TPrimaryKey = number
> {
  abstract readonly tableName: string;
  abstract readonly resourceClass: TResource;

  readonly dataLoader: DataLoader<TPrimaryKey, InstanceType<TResource>>;

  private dataLoaders: Map<
    keyof TRecord,
    DataLoader<unknown, InstanceType<TResource>>
  > = new Map();

  constructor() {
    this.dataLoader = new DataLoader((ids: TPrimaryKey[]) => {
      return this.table.whereIn('id', ids).then(records => {
        return this.mapResources(records as TRecord[]);
      });
    });
  }

  protected get table() {
    return database<TRecord>(this.tableName);
  }

  protected dataLoaderFor<K extends keyof TRecord>(
    key: K
  ): DataLoader<TRecord[K], InstanceType<TResource>> {
    let dataLoader:
      | DataLoader<TRecord[K], InstanceType<TResource>>
      | undefined = this.dataLoaders.get(key);

    if (dataLoader == null) {
      dataLoader = new DataLoader(values => {
        return this.whereIn(key, values);
      });

      this.dataLoaders.set(key, dataLoader);
    }

    return dataLoader;
  }

  async where<K extends keyof TRecord>(
    key: K,
    value: TRecord[K]
  ): Promise<InstanceType<TResource>[]>;

  async where(attributes: Partial<TRecord>): Promise<InstanceType<TResource>[]>;

  async where<K extends keyof TRecord>(
    keyOrAttributes: Partial<TRecord> | K,
    value?: TRecord[K]
  ) {
    let records;

    if (typeof keyOrAttributes === 'string' && value != null) {
      records = await this.table.where(keyOrAttributes, value);
    } else {
      records = await this.table.where(keyOrAttributes);
    }

    return this.mapResources(records as TRecord[]);
  }

  async whereIn<K extends keyof TRecord>(
    key: K,
    values: TRecord[K][]
  ): Promise<InstanceType<TResource>[]> {
    const records = await this.table.whereIn(key, values);

    return this.mapResources(records as TRecord[]);
  }

  async find(id: TPrimaryKey) {
    const rows = await this.table.where({ id }).limit(1);

    if (rows[0] !== null) {
      return this.dataLoader.load(id);
    } else {
      throw new Error(`Could not find record`);
    }
  }

  async findBy(attributes: Partial<TRecord>) {
    const rows = await this.table.where(attributes).limit(1);

    if (rows[0] !== null) {
      return this.mapResource(rows[0] as TRecord);
    } else {
      return null;
    }
  }

  protected mapResource = (record: TRecord): InstanceType<TResource> => {
    return new this.resourceClass(record) as InstanceType<TResource>;
  };

  protected mapResources = (records: TRecord[]): InstanceType<TResource>[] => {
    return records.map(this.mapResource);
  };
}
