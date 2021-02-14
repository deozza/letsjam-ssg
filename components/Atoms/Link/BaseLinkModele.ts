export default class BaseLinkModele {
  link: string
  title: string
  customClasses: Array<string>
  internalLink: boolean
  icon: string
  customLink: boolean

  constructor(
    link: string,
    title: string,
    customClasses: Array<string> = [],
    icon: string = '',
    internalLink: boolean = true,
    customLink: boolean = false
  ) {
    this.link = link
    this.title = title
    this.customClasses = customClasses
    this.internalLink = internalLink
    this.icon = icon
    this.customLink = customLink
  }
}
