import ResourceSelectQuery from './ResourceSelectQuery';
import Table from './Table';
import InsertQuery from './InsertQuery';
import UpdateQuery from './UpdateQuery';
import DeleteQuery from './DeleteQuery';
import { Schema, ResourceClass, WhereConditions, Attributes } from './types';

// interface InsertAction<T> {
//   type: 'INSERT';
//   resources: T[];
// }

// interface UpdateAction<T> {
//   type: 'UPDATE';
//   resources: T[];
// }

// interface DeleteAction<T> {
//   type: 'DELETE';
//   resources: T[];
// }

// type Action<T> = InsertAction<T> | UpdateAction<T> | DeleteAction<T>;

export default abstract class Repository<
  TSchema extends Schema,
  TResource extends ResourceClass<TSchema>,
  TPrimaryKey = number
> {
  abstract readonly resourceClass: TResource;
  private _selectQuery?: ResourceSelectQuery<TSchema, TResource, TPrimaryKey>;

  // private readonly observers: Set<
  //   ObserverLike<InsertAction<InstanceType<TResource>>>
  // > = new Set();

  find(...ids: TPrimaryKey[]) {
    return this.selectQuery.find(ids);
  }

  where(
    conditions: WhereConditions<TSchema>
  ): ResourceSelectQuery<TSchema, TResource, TPrimaryKey> {
    return this.selectQuery.where(conditions);
  }

  async insert(attributes: Partial<Attributes<TSchema>>) {
    const resource = await new InsertQuery(this.resourceClass, attributes);

    // this.broadcastAction({ type: 'INSERT', resources: [resource] });

    return resource;
  }

  async update(
    conditions: WhereConditions<TSchema>,
    attributes: Partial<Attributes<TSchema>>
  ) {
    const resources = await new UpdateQuery(
      this.resourceClass,
      conditions,
      attributes
    );

    // this.broadcastAction({ type: 'UPDATE', resources });

    return resources;
  }

  async delete(conditions: WhereConditions<TSchema>) {
    const resources = await new DeleteQuery(this.resourceClass, conditions);

    // this.broadcastAction({ type: 'DELETE', resources });

    return resources;
  }

  // subscribe(
  //   partialObserver: PartialObserver<Action<InstanceType<TResource>>>
  // ): Subscription<Action<InstanceType<TResource>>> {
  //   const observer = completeObserver(partialObserver);

  //   this.observers.add(observer);

  //   return new Subscription(observer, () => {
  //     return () => {
  //       this.observers.delete(observer);
  //     };
  //   });
  // }

  // protected broadcastAction(action: Action<InstanceType<TResource>>) {
  //   for (const observer of this.observers) {
  //     observer.next(action);
  //   }
  // }

  protected get table(): Table<TSchema> {
    return this.resourceClass.table;
  }

  protected get selectQuery(): ResourceSelectQuery<
    TSchema,
    TResource,
    TPrimaryKey
  > {
    if (this._selectQuery == null) {
      this._selectQuery = new ResourceSelectQuery(this.resourceClass);
    }

    return this._selectQuery;
  }
}
