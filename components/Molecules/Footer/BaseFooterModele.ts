import BaseFooterInterface from '~/components/Molecules/Footer/BaseFooterInterface'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default class BaseFooterModele implements BaseFooterInterface {
  links: Array<BaseLinkModele>
  theme: string
  copyright: string

  constructor(links: Array<BaseLinkModele>, theme: string, copyright: string) {
    this.links = links
    this.theme = theme
    this.copyright = copyright
  }
}
