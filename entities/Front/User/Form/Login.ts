export default class Login {
  credential: string
  password: string

  constructor(credential: string, password: string) {
    this.credential = credential
    this.password = password
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
