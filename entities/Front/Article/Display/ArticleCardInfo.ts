import Article from '~/entities/Api/Article/Article'
import User from '~/entities/Api/User/User'

export default class ArticleCardInfo {
  title: string
  dateOfLastUpdate: number
  authorDisplayName: string
  totalViews: number
  totalLikes: number
  tags: Array<string>

  constructor(article: Article, user: User) {
    this.title = article.title

    this.dateOfLastUpdate = article.dateOfLastUpdate

    this.authorDisplayName = user.displayName

    this.totalViews = article.totalViews

    this.totalLikes = article.totalLikes

    this.tags = article.tags
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
