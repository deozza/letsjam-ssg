export default class Register {
  displayName: string
  email: string
  password: string

  constructor(displayName: string, email: string, password: string) {
    this.displayName = displayName
    this.email = email
    this.password = password
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
