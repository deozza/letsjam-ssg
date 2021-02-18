import { uuid } from 'vue-uuid'

export enum ArticleVersionState {
  DRAFT = 'DRAFT',
  PRE_PUBLISHED = 'PRE_PUBLISHED',
  PUBLISHED = 'PRE_PUBLISHED',
  MODERATED = 'MODERATED',
  ARCHIVED = 'ARCHIVED',
}

export default class ArticleVersion {
  uid: string
  articleUid: string
  dateOfCreation: number
  dateOfLastUpdate: number
  versionNumber: number
  content: string
  likes: number
  state: ArticleVersionState

  constructor(articleVersion: object) {
    // @ts-ignore
    this.uid = 'uid' in articleVersion ? articleVersion.uid : uuid.v4()

    // @ts-ignore
    this.articleUid = 'articleUid' in articleVersion ? articleVersion.articleUid : ''

    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in articleVersion ? articleVersion.dateOfCreation : Date.now()

    // @ts-ignore
    this.dateOfLastUpdate = 'dateOfLastUpdate' in articleVersion ? articleVersion.dateOfLastUpdate : Date.now()

    // @ts-ignore
    this.versionNumber = 'versionNumber' in articleVersion ? articleVersion.versionNumber : 0

    // @ts-ignore
    this.content = 'content' in articleVersion ? articleVersion.content : ''

    // @ts-ignore
    this.state = 'state' in articleVersion ? articleVersion.state : ArticleVersionState.DRAFT

    // @ts-ignore
    this.likes = 'likes' in articleVersion ? articleVersion.likes : 0

  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
