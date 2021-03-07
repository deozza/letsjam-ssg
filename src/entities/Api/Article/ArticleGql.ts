import VersionGql from '~/entities/Api/Article/VersionGql'
import ProfileGql from '~/entities/Api/User/ProfileGql'

export default class ArticleGql {
  uid: number
  title: string
  dateOfCreation: number
  dateOfLastUpdate: number
  totalLikes: number
  versions: Array<VersionGql>
  currentVersion: VersionGql
  tags: Array<string>
  user: ProfileGql

  constructor(articleFromGraphql: object) {

    // @ts-ignore
    this.uid = 'uid' in articleFromGraphql ? articleFromGraphql.uid : ''

    // @ts-ignore
    this.title = 'title' in articleFromGraphql ? articleFromGraphql.title : ''

    // @ts-ignore
    this.dateOfCreation = 'dateOfCreation' in articleFromGraphql ? articleFromGraphql.dateOfCreation: new Date()

    // @ts-ignore
    this.dateOfLastUpdate = 'dateOfLastUpdate' in articleFromGraphql ?articleFromGraphql.dateOfLastUpdate : new Date()

    // @ts-ignore
    this.totalLikes = 'totalLikes' in articleFromGraphql ?articleFromGraphql.totalLikes : 0

    this.versions = []

    // @ts-ignore
    if(articleFromGraphql.versions !== undefined && articleFromGraphql.versions != null){
        // @ts-ignore
        for(let version of articleFromGraphql.versions){
          this.versions.push(new VersionGql(version))
        }
    }

    // @ts-ignore
    this.currentVersion = 'currentVersion' in articleFromGraphql ? new VersionGql(articleFromGraphql.currentVersion) : {}

    // @ts-ignore
    this.tags = 'tags' in articleFromGraphql ? articleFromGraphql.tags : []

    // @ts-ignore
    this.user = 'user' in articleFromGraphql ? new ProfileGql(articleFromGraphql.user) : {}
  }
}
