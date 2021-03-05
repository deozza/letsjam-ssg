import { uuid } from 'vue-uuid'
import VersionGql from '~/entities/Api/Article/VersionGql'
import { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'

export default class ArticleVersionPageEdit {
  uid: string
  articleUid: string
  dateOfCreation: string
  dateOfLastUpdate: string
  versionNumber: number | null
  content: string
  likes: number
  stateIcon: string
  state: string

  constructor(articleVersion: VersionGql) {
    // @ts-ignore
    this.uid = 'uid' in articleVersion ? articleVersion.uid : uuid.v4()

    // @ts-ignore
    this.articleUid = 'articleUid' in articleVersion ? articleVersion.articleUid : ''

    // @ts-ignore
    const dateOfCreation: number = +articleVersion.dateOfCreation
    this.dateOfCreation = new Date(dateOfCreation).toLocaleString()

    // @ts-ignore
    const dateOfLastUpdate: number = +articleVersion.dateOfLastUpdate
    this.dateOfLastUpdate = new Date(dateOfLastUpdate).toLocaleString()

    // @ts-ignore
    this.versionNumber = 'versionNumber' in articleVersion ? articleVersion.versionNumber : null

    // @ts-ignore
    this.content = 'content' in articleVersion ? articleVersion.content : ''

    // @ts-ignore
    this.stateIcon = this.getIconAccordingToState(articleVersion.state)

    // @ts-ignore
    this.state = articleVersion.state


    // @ts-ignore
    this.likes = 'likes' in articleVersion ? articleVersion.likes : 0

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

    if(state === ArticleVersionState.ARCHIVED){
      icon = icon.replace('__icon', 'fa-lock').replace('__title', 'Archivé').replace('__color', 'grey')
    }

    return icon
  }
}
