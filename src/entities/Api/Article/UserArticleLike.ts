export default class UserArticleLike {
  dateOfCreation: number
  userUid: string
  articleUid: string
  articleVersionUid: string

  constructor(userArticleLike: object) {
    // @ts-ignore
    this.userUid = 'userUid' in userArticleLike ? userArticleLike.userUid : ''

    // @ts-ignore
    this.articleUid = 'articleUid' in userArticleLike ? userArticleLike.articleUid : ''

    // @ts-ignore
    this.articleVersionUid = 'articleVersionUid' in userArticleLike ? userArticleLike.articleVersionUid : ''

    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in userArticleLike ? userArticleLike.dateOfCreation : Date.now()

  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
