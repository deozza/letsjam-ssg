import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class ArticleCardInfoProfilePage {
  title: string
  dateOfLastUpdate: number
  totalLikes: number
  articleLink: BaseLinkModele

  constructor(articleGql: ArticleGql) {
    // @ts-ignore
    this.title = articleGql.title

    // @ts-ignore
    this.dateOfLastUpdate = articleGql.dateOfLastUpdate

    // @ts-ignore
    this.totalLikes = articleGql.totalLikes

    this.articleLink = new BaseLinkModele(
      ['profile', 'article', this.title],
      this.title,
      true
    )
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
