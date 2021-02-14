export default class Article {
  title: string
  dateOfCreation: number
  dateOfLastUpdate: number
  authorUid: string
  versions: Array<string>
  currentVersion: string
  totalViews: number
  totalLikes: number
  tags: Array<string>

  constructor(article: object) {
    // @ts-ignore
    this.title = 'title' in article ? article.title : ''

    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in article ? article.dateOfCreation : Date.now()

    // @ts-ignore
    this.dateOfLastUpdate = 'dateOfLastUpdate' in article ? article.dateOfLastUpdate : Date.now()

    // @ts-ignore
    this.authorUid = 'authorUid' in article ? article.authorUid : ''

    // @ts-ignore
    this.versions = 'versions' in article ? article.versions : []

    // @ts-ignore
    this.currentVersion = 'currentVersion' in article ? article.currentVersion : ''

    // @ts-ignore
    this.totalViews = 'totalViews' in article ? article.totalViews : 0

    // @ts-ignore
    this.totalLikes = 'totalLikes' in article ? article.totalLikes : 0

    // @ts-ignore
    this.tags = 'tags' in article ? article.tags : {}
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
