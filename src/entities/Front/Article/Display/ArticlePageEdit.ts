import ArticleGql from '~/entities/Api/Article/ArticleGql'
import { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'
import ArticleVersionPageEdit from '~/entities/Front/Article/Display/ArticleVersionPageEdit'
import VersionGql from '~/entities/Api/Article/VersionGql'
import BaseTagModele from '~/components/Atoms/Tag/BaseTagModele'

export default class ArticlePageEdit {
  uid: string
  title: string
  dateOfCreation: string
  dateOfLastUpdate: string
  totalLikes: number
  tags: Array<BaseTagModele>
  versions: Array<VersionGql>
  lastVersion: ArticleVersionPageEdit | null
  publishedVersion: ArticleVersionPageEdit | null
  draftVersion: ArticleVersionPageEdit | null
  olderVersions: Array<ArticleVersionPageEdit>
  allVersionsAreArchived: boolean

  constructor(article: ArticleGql) {

    // @ts-ignore
    this.uid = article.uid

    // @ts-ignore
    this.title = article.title

    // @ts-ignore
    const dateOfCreation: number = +article.dateOfCreation
    this.dateOfCreation = new Date(dateOfCreation).toLocaleString()

    // @ts-ignore
    const dateOfLastUpdate: number = +article.dateOfLastUpdate
    this.dateOfLastUpdate = new Date(dateOfLastUpdate).toLocaleString()

    // @ts-ignore
    this.totalLikes = article.totalLikes

    // @ts-ignore
    this.tags = []


    article.tags.forEach(tag => this.tags.push(new BaseTagModele(tag, false, true)))

    this.versions = article.versions

    this.allVersionsAreArchived = true

    this.publishedVersion = null

    if(article.currentVersion.state === ArticleVersionState.PUBLISHED){
      this.allVersionsAreArchived = false
      const publishedVersionObject: VersionGql = article.versions.find(version => version.uid === article.currentVersion.uid) as VersionGql
      this.publishedVersion = new ArticleVersionPageEdit(publishedVersionObject)
    }

    let lastVersionNumber = 0;
    let lastVersion: VersionGql = article.versions[lastVersionNumber]
    for(const version of article.versions){
      if(version.versionNumber > lastVersion.versionNumber){
        lastVersion = version
      }
    }

    this.lastVersion = null
    if(lastVersion.state !== ArticleVersionState.PUBLISHED){
      this.allVersionsAreArchived = false
      this.lastVersion = new ArticleVersionPageEdit(lastVersion)
    }

    this.olderVersions = []
    this.draftVersion = null
    for(let articleVersion of article.versions) {

      if(articleVersion.state === ArticleVersionState.ARCHIVED){
        this.olderVersions.push(new ArticleVersionPageEdit(articleVersion))
      }

      if(articleVersion.state === ArticleVersionState.DRAFT){
        this.allVersionsAreArchived = false
        this.draftVersion = new ArticleVersionPageEdit(articleVersion)
      }
    }
  }

  toJSON(): any {
    return Object.setPrototypeOf(this, Object.prototype)
  }
}
