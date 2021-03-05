import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import ArticlesGql from '~/entities/Api/Article/ArticlesGql'

export default class ArticleCardInfoProfilePage {
  title: string
  dateOfLastUpdate: number
  totalLikes: number
  articleLink: BaseLinkModele

  constructor(articlesGql: ArticlesGql) {
    // @ts-ignore
    this.title = articlesGql.title

    // @ts-ignore
    this.dateOfLastUpdate = articlesGql.dateOfLastUpdate

    // @ts-ignore
    this.totalLikes = articlesGql.totalLikes

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
