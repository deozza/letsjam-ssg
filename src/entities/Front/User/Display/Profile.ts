import ProfileGql from '~/entities/Api/User/ProfileGql'
import BaseTagModele from '~/components/Atoms/Tag/BaseTagModele'

export default class Profile {
  displayName: string
  email: string
  tags: Array<BaseTagModele>

  constructor(profile: ProfileGql) {
    this.displayName = profile.displayName
    this.email = profile.email

    this.tags = []

    profile.tags.forEach(tag => {
      this.tags.push(new BaseTagModele(tag))
    })

  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
