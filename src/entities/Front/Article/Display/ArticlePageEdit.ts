import ArticleGql from '~/entities/Api/Article/ArticleGql'
import { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'
import ArticleVersionPageEdit from '~/entities/Front/Article/Display/ArticleVersionPageEdit'
import VersionGql from '~/entities/Api/Article/VersionGql'

export default class ArticlePageEdit {
  uid: string
  title: string
  dateOfCreation: string
  dateOfLastUpdate: string
  totalLikes: number
  tags: Array<string>
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
    this.tags = article.tags

    this.versions = article.versions

    this.allVersionsAreArchived = true

    this.publishedVersion = null

    if(article.currentVersion.state === ArticleVersionState.PUBLISHED){
      this.allVersionsAreArchived = false
      this.publishedVersion = new ArticleVersionPageEdit(article.versions[article.currentVersion.versionNumber])
    }

    let lastVersionNumber = 0;
    for(const version of article.versions){
      if(version.versionNumber > lastVersionNumber){
        lastVersionNumber = version.versionNumber
      }
    }

    this.lastVersion = null
    const lastVersion = article.versions[lastVersionNumber]
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
