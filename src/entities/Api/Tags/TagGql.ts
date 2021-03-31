
export default class TagGql {
  name: string

  constructor(tagFromGraphql: object) {
    // @ts-ignore
    this.name = 'name' in tagFromGraphql ? tagFromGraphql.name : ''
  }
}
