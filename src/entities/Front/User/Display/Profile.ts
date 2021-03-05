import ProfileGql from '~/entities/Api/User/ProfileGql'

export default class Profile {
  displayName: string
  email: string

  constructor(profile: ProfileGql) {
    this.displayName = profile.displayName
    this.email = profile.email
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
