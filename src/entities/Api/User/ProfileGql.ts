import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class ProfileGql {
  displayName: string
  email: string
  articles: Array<ArticleGql>

  constructor(profileFromGraphql: object) {
    // @ts-ignore
    this.displayName = 'displayName' in profileFromGraphql ? profileFromGraphql.displayName : ''

    // @ts-ignore
    this.email = 'displayName' in profileFromGraphql ? profileFromGraphql.email : ''
    
    this.articles = []

    // @ts-ignore
    if(profileFromGraphql.articles !== undefined){
      // @ts-ignore
      for(let article of profileFromGraphql.articles){
        this.articles.push(new ArticleGql(article))
      }
    }


  }
}
