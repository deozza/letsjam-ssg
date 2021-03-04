export default class ArticleGql {
  title: string
  currentVersion: object
  dateOfLastUpdate: number
  user: object
  totalLikes: number

  constructor(articleFromGraphql: object) {
    // @ts-ignore
    this.title = articleFromGraphql.title

    // @ts-ignore
    this.currentVersion = articleFromGraphql.currentVersion

    // @ts-ignore
    this.dateOfLastUpdate = articleFromGraphql.dateOfLastUpdate

    // @ts-ignore
    this.user = articleFromGraphql.user

    // @ts-ignore
    this.totalLikes = articleFromGraphql.totalLikes
  }
}
