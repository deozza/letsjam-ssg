import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default interface BaseFooterInterface {
  theme: string
  links: Array<BaseLinkModele>
  copyright: string
}
