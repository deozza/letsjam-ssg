
export default class ArticlePost {
  title: string
  tags: Array<string>
  content: string
  authorUid: string

  constructor(
    authorUid: string,
    title: string = '',
    content: string = '',
    tags: Array<string> = []
  ) {
    this.authorUid = authorUid

    this.title = title

    this.content = content

    this.tags = tags
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
