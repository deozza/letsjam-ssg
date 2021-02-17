import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default class ArticleCardInfo {
  title: string
  dateOfLastUpdate: number
  authorDisplayName: string
  totalViews: number
  totalLikes: number
  articleLink: BaseLinkModele
  authorLink: BaseLinkModele

  constructor(articleFromGraphql: object) {
    // @ts-ignore
    this.title = articleFromGraphql.title

    // @ts-ignore
    this.dateOfLastUpdate = articleFromGraphql.dateOfLastUpdate

    // @ts-ignore
    this.authorDisplayName = articleFromGraphql.user.displayName

    // @ts-ignore
    this.totalViews = articleFromGraphql.totalViews

    // @ts-ignore
    this.totalLikes = articleFromGraphql.totalLikes

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
