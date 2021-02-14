export enum ArticleVersionState {
  DRAFT = 'DRAFT',
  PRE_PUBLISHED = 'PRE_PUBLISHED',
  PUBLISHED = 'PRE_PUBLISHED',
  MODERATED = 'MODERATED',
  ARCHIVED = 'ARCHIVED',
}

export default class ArticleVersion {
  articleUid: string
  dateOfCreation: number
  dateOfLastUpdate: number
  versionNumber: number
  filePaths: object
  views: number
  likes: number
  state: ArticleVersionState

  constructor(articleVersion: object) {
    // @ts-ignore
    this.articleUid = 'articleUid' in articleVersion ? articleVersion.articleUid : ''

    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in articleVersion ? articleVersion.dateOfCreation : Date.now()

    // @ts-ignore
    this.dateOfLastUpdate = 'dateOfLastUpdate' in articleVersion ? articleVersion.dateOfLastUpdate : Date.now()

    // @ts-ignore
    this.versionNumber = 'versionNumber' in articleVersion ? articleVersion.versionNumber : 0

    // @ts-ignore
    this.filePaths = 'filePaths' in articleVersion ? articleVersion.filePaths : {}

    // @ts-ignore
    this.state = 'state' in articleVersion ? articleVersion.state : ArticleVersionState.DRAFT

    // @ts-ignore
    this.views = 'views' in articleVersion ? articleVersion.views : 0

    // @ts-ignore
    this.likes = 'likes' in articleVersion ? articleVersion.likes : 0

  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
