export default class ArticlesGql {
  title: string
  dateOfLastUpdate: number
  dateOfCreation: number
  user: string
  totalLikes: number

  constructor(articleFromGraphql: object) {
    // @ts-ignore
    this.title = articleFromGraphql.title

    // @ts-ignore
    this.dateOfLastUpdate = articleFromGraphql.dateOfLastUpdate

    // @ts-ignore
    this.dateOfCreation = articleFromGraphql.dateOfCreation

    // @ts-ignore
    this.user = articleFromGraphql.user

    // @ts-ignore
    this.totalLikes = articleFromGraphql.totalLikes
  }
}
