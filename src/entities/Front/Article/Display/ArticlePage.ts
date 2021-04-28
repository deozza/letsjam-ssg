import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class ArticlePage {
  title: string
  dateOfLastUpdate: number
  authorDisplayName: string
  totalLikes: number
  tags: Array<BaseLinkModele>
  content: string
  authorLink: BaseLinkModele
  isLikedByReader: boolean

  constructor(article: ArticleGql) {
    // @ts-ignore
    this.title = article.title

    // @ts-ignore
    this.dateOfLastUpdate = article.dateOfLastUpdate

    // @ts-ignore
    this.authorDisplayName = article.user.displayName

    // @ts-ignore
    this.totalLikes = article.totalLikes

    // @ts-ignore
    this.tags = []

    article.tags.forEach((tag:string) => {
      const searchLinkForTag: BaseLinkModele = new BaseLinkModele(['search', tag], '#'+tag, true, '', ['tag-link'])
      this.tags.push(searchLinkForTag)
    })

    // @ts-ignore
    this.content = article.currentVersion.content

    // @ts-ignore
    this.authorLink = new BaseLinkModele(
      ['user', this.authorDisplayName],
      this.title,
      true
    )

    this.isLikedByReader= article.isLikedByReader
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
