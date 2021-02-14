import BaseCardInterface from '~/components/Molecules/Card/BaseCardInterface'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import BaseVideoModele from '~/components/Atoms/Media/Video/BaseVideoModele'
import BaseImageModele from '~/components/Atoms/Media/Image/BaseImageModele'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'

export default class BaseCardModele implements BaseCardInterface {
  tags: Array<string>
  title: BaseLinkModele
  author: BaseLinkModele
  date: string
  image: BaseImageModele | any
  video: BaseVideoModele | any

  constructor(article: ArticleCardInfo) {
    this.title = BaseCardModele.getTitleLink(article)
    this.tags = article.tags
    this.author = BaseCardModele.getAuthorLink(article)
    this.date = new Date(article.dateOfLastUpdate).toLocaleString()
    this.image = null
    this.video = null
  }

  private static getAuthorLink(
    articleCardInfo: ArticleCardInfo
  ): BaseLinkModele {
    return {
      title: articleCardInfo.authorDisplayName,
      link: '/users/' + encodeURI(articleCardInfo.authorDisplayName),
      internalLink: true,
      customLink: true,
      customClasses: [],
      icon: '',
    }
  }

  private static getTitleLink(
    articleCardInfo: ArticleCardInfo
  ): BaseLinkModele {
    return {
      title: articleCardInfo.title,
      link:
        '/users/' +
        encodeURI(articleCardInfo.authorDisplayName) +
        '/articles/' +
        encodeURI(articleCardInfo.title),
      internalLink: true,
      customLink: true,
      customClasses: [],
      icon: '',
    }
  }
}
