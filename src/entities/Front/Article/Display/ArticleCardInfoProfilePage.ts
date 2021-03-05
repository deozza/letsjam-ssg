import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'

export default class ArticleCardInfoProfilePage {
  title: string
  dateOfLastUpdate: string
  totalLikes: number
  articleLink: BaseLinkModele
  state: string

  constructor(articleGql: ArticleGql) {
    // @ts-ignore
    this.title = articleGql.title

    // @ts-ignore
    const timestampAsNumber: number = +articleGql.dateOfLastUpdate
    this.dateOfLastUpdate = new Date(timestampAsNumber).toLocaleString()

    // @ts-ignore
    this.totalLikes = articleGql.totalLikes

    this.articleLink = new BaseLinkModele(
      ['profile', 'article', this.title],
      'Editer',
      true,
      'fas fa-external-link-alt'
    )

    // @ts-ignore
    this.state = this.getIconAccordingToState(articleGql.currentVersion.state)
  }

  getIconAccordingToState(state: string): string {
    let icon = '<i class="fas __icon" title="__title" style="color: __color"></i>'

    if(state === ArticleVersionState.DRAFT){
      icon = icon.replace('__icon', 'fa-edit').replace('__title', 'Brouillon').replace('__color', 'cornflowerblue')
    }

    if(state === ArticleVersionState.PRE_PUBLISHED){
      icon = icon.replace('__icon', 'fa-search').replace('__title', 'Vérification').replace('__color', 'black')
    }

    if(state === ArticleVersionState.PUBLISHED){
      icon = icon.replace('__icon', 'fa-check').replace('__title', 'Publié').replace('__color', 'green')
    }

    if(state === ArticleVersionState.MODERATED){
      icon = icon.replace('__icon', 'fa-times').replace('__title', 'Modéré').replace('__color', 'red')
    }

    return icon
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
