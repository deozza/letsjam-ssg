import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class VersionGql {
  uid: string
  content: string
  dateOfCreation: number
  dateOfLastUpdate: number
  likes: number
  state: string
  versionNumber: number
  article: ArticleGql

  constructor(versionFromGraphql: object) {
    // @ts-ignore
    this.uid = 'uid' in versionFromGraphql ? versionFromGraphql.uid : ''

    // @ts-ignore
    this.content = 'content' in versionFromGraphql ? versionFromGraphql.content :  ''

    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in versionFromGraphql ? versionFromGraphql.dateOfCreation : new Date()

    // @ts-ignore
    this.dateOfLastUpdate = 'dateOfLastUpdate' in versionFromGraphql ? versionFromGraphql.dateOfLastUpdate : new Date()

    // @ts-ignore
    this.likes = 'likes' in versionFromGraphql ? versionFromGraphql.likes : 0

    // @ts-ignore
    this.state = 'state' in versionFromGraphql ? versionFromGraphql.state : ''

    // @ts-ignore
    this.versionNumber = 'versionNumber' in versionFromGraphql ? versionFromGraphql.versionNumber : 0

    // @ts-ignore
    this.article = 'article' in versionFromGraphql ? new ArticleGql(versionFromGraphql.article) : {}
  }
}
