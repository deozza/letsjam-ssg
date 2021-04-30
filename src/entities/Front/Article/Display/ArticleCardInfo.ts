import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class ArticleCardInfo {
  title: string
  dateOfLastUpdate: number
  dateOfLastUpdateComputed: string
  authorDisplayName: string
  totalLikes: number
  articleLink: BaseLinkModele
  authorLink: BaseLinkModele
  tags: Array<BaseLinkModele>

  constructor(articleGql: ArticleGql) {
    // @ts-ignore
    this.title = articleGql.title

    // @ts-ignore
    this.dateOfLastUpdate = articleGql.dateOfLastUpdate

    const timestampAsNumber: number = +articleGql.dateOfLastUpdate
    this.dateOfLastUpdateComputed = 'Le ' + new Date(timestampAsNumber).toLocaleTimeString(['FR-fr'], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})

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
      'De ' + this.authorDisplayName,
      true
    )

    this.tags = []

    articleGql.tags.forEach((tag:string) => {
      const searchLinkForTag: BaseLinkModele = new BaseLinkModele(['search', tag], '#'+tag, true, '', ['tag-link'])
      this.tags.push(searchLinkForTag)
    })
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
