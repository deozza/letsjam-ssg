export default class User {
  uid: string
  displayName: string
  email: string
  dateOfCreation: number
  dateOfLastUpdate: number
  active: boolean

  constructor(user: object | null) {
    // @ts-ignore
    this.uid = 'uid' in user ? user.uid : ''
    // @ts-ignore
    this.displayName = 'displayName' in user ? user.displayName : ''
    // @ts-ignore
    this.email = 'email' in user ? user.email : ''
    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in user ? user.dateOfCreation : Date.now()
    // @ts-ignore
    this.dateOfLastUpdate = 'dateOfLastUpdate' in user ? user.dateOfLastUpdate : Date.now()
    // @ts-ignore
    this.active = 'active' in user ? user.active : false
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
