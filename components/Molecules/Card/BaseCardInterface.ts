import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import BaseImageModele from '~/components/Atoms/Media/Image/BaseImageModele'
import BaseVideoModele from '~/components/Atoms/Media/Video/BaseVideoModele'

export default interface BaseCardInterface {
  title: BaseLinkModele
  tags: Array<string>
  author: BaseLinkModele
  date: string
  image: BaseImageModele | any
  video: BaseVideoModele | any
}
