import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import ArticlesGql from '~/entities/Api/Article/ArticlesGql'

export default class ArticleCardInfo {
  title: string
  dateOfLastUpdate: number
  authorDisplayName: string
  totalLikes: number
  articleLink: BaseLinkModele
  authorLink: BaseLinkModele

  constructor(articlesGql: ArticlesGql) {
    // @ts-ignore
    this.title = articlesGql.title

    // @ts-ignore
    this.dateOfLastUpdate = articlesGql.dateOfLastUpdate

    // @ts-ignore
    this.authorDisplayName = articlesGql.user.displayName

    // @ts-ignore
    this.totalLikes = articlesGql.totalLikes

    this.articleLink = new BaseLinkModele(
      ['user', this.authorDisplayName, 'article', this.title],
      this.title,
      true
    )
    this.authorLink = new BaseLinkModele(
      ['user', this.authorDisplayName],
      this.title,
      true
    )
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
