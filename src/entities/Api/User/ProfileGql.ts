import ArticleGql from '~/entities/Api/Article/ArticleGql'

export default class ProfileGql {
  displayName: string
  email: string
  articles: Array<ArticleGql>
  likedArticles: Array<ArticleGql>
  tags: Array<string>

  constructor(profileFromGraphql: object) {
    // @ts-ignore
    this.displayName = 'displayName' in profileFromGraphql ? profileFromGraphql.displayName : ''

    // @ts-ignore
    this.email = 'displayName' in profileFromGraphql ? profileFromGraphql.email : ''

    // @ts-ignore
    this.tags = 'tags' in profileFromGraphql ? profileFromGraphql.tags : []

    this.articles = []
    this.likedArticles = []

    // @ts-ignore
    if(profileFromGraphql.articles !== undefined){
      // @ts-ignore
      for(let article of profileFromGraphql.articles){
        this.articles.push(new ArticleGql(article))
      }
    }
    // @ts-ignore
    if(profileFromGraphql.likedArticles !== undefined){
      // @ts-ignore
      for(let article of profileFromGraphql.likedArticles){
        this.likedArticles.push(new ArticleGql(article))
      }
    }
  }
}
