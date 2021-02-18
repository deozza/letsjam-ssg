import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default class ArticlePage {
  title: string
  dateOfLastUpdate: number
  authorDisplayName: string
  totalLikes: number
  tags: Array<string>
  content: string
  authorLink: BaseLinkModele

  constructor(article: object) {
    // @ts-ignore
    this.title = article.title

    // @ts-ignore
    this.dateOfLastUpdate = article.dateOfLastUpdate

    // @ts-ignore
    this.authorDisplayName = article.user.displayName

    // @ts-ignore
    this.totalLikes = article.totalLikes

    // @ts-ignore
    this.tags = article.tags

    // @ts-ignore
    this.content = article.currentVersion.content

    // @ts-ignore
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
