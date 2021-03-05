export default class ProfileGql {
  displayName: string
  email: string
  articles: Array<object>

  constructor(profileFromGraphql: object) {
    // @ts-ignore
    this.displayName = profileFromGraphql.displayName

    // @ts-ignore
    this.email = profileFromGraphql.email

    // @ts-ignore
    this.articles = profileFromGraphql.articles

  }
}
