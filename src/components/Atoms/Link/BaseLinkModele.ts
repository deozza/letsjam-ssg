export default class BaseLinkModele {
  link: string
  title: string
  customClasses: Array<string>
  internalLink: boolean
  icon: string

  constructor(
    linkParts: Array<string>,
    title: string,
    internalLink: boolean = true,
    icon: string = '',
    customClasses: Array<string> = []
  ) {
    this.link = this.buildLink(linkParts)
    this.title = title
    this.customClasses = customClasses
    this.internalLink = internalLink
    this.icon = icon
  }

  private buildLink(linkParts: Array<string>): string {
    let link: string = '/'

    for (const part in linkParts) {
      link += encodeURI(linkParts[part])

      // @ts-ignore
      if (part != linkParts.length - 1) {
        link += '/'
      }
    }

    return link
  }
}
