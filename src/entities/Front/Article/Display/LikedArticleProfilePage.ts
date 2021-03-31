import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class ArticleCardInfoProfilePage {
  title: string
  authorDisplayName: string
  contentExtract: string

  constructor(articleGql: ArticleGql) {
    // @ts-ignore
    this.title = articleGql.title

    // @ts-ignore
    this.authorDisplayName = articleGql.user.displayName

    // @ts-ignore
    this.contentExtract = articleGql.currentVersion.content.split(/\s+/).slice(0,10).join(" ")+'...';
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
