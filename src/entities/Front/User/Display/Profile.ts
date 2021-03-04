import User from '~/entities/Api/User/User'

export default class Profile {
  displayName: string
  email: string

  constructor(user: User) {
    this.displayName = user.displayName
    this.email = user.email
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
