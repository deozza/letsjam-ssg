import { uuid } from 'vue-uuid'

export default class ArticlePost {
  uid: string
  title: string
  authorUid: string
  currentVersion: string
  tags: Array<string>

  constructor(article: object) {
    // @ts-ignore
    this.uid = 'uid' in article ? article.uid : uuid.v4()

    // @ts-ignore
    this.title = 'title' in article ? article.title : ''

    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in article ? article.dateOfCreation : Date.now()

    // @ts-ignore
    this.dateOfLastUpdate = 'dateOfLastUpdate' in article ? article.dateOfLastUpdate : Date.now()

    // @ts-ignore
    this.authorUid = 'authorUid' in article ? article.authorUid : ''

    // @ts-ignore
    this.currentVersion = 'currentVersion' in article ? article.currentVersion : ''

    // @ts-ignore
    this.totalLikes = 'totalLikes' in article ? article.totalLikes : 0

    // @ts-ignore
    this.tags = 'tags' in article ? article.tags.map(tag => tag.title) : []
  }


  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
