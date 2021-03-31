import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class ArticleCardInfo {
  title: string
  dateOfLastUpdate: number
  authorDisplayName: string
  totalLikes: number
  articleLink: BaseLinkModele
  authorLink: BaseLinkModele
  tags: Array<string>

  constructor(articleGql: ArticleGql) {
    // @ts-ignore
    this.title = articleGql.title

    // @ts-ignore
    this.dateOfLastUpdate = articleGql.dateOfLastUpdate

    // @ts-ignore
    this.authorDisplayName = articleGql.user.displayName

    // @ts-ignore
    this.totalLikes = articleGql.totalLikes

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

    this.tags = articleGql.tags
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
