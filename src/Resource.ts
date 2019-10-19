export default class Resource<TRecord extends {}> {
  protected readonly attributes: TRecord;

  constructor(attributes: TRecord) {
    this.attributes = attributes;
  }
}
