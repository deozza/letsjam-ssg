import { ActionTree, MutationTree, GetterTree } from 'vuex'
import Article from '~/entities/Api/Article/Article'
import articleQuery from '~/apollo/queries/Article/article.gql'
import articlesQuery from '~/apollo/queries/Article/articles.gql'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'

export type State = {
  list: Array<Article>
  article: Article
}

export const state = (): State => ({
  list: [],
  article: new Article({}),
})

export type RootState = ReturnType<typeof state>

export const actions: ActionTree<RootState, RootState> = {
  async GET({ commit }) {
    const apolloClient = this.app.apolloProvider.defaultClient

    let articles = []

    try {
      articles = await apolloClient.query({
        query: articlesQuery,
      })
    } catch (e) {
      console.log(e)
    }

    commit('SET_LIST', articles.data.articles)
  },
  async SHOW({ commit }, { params }) {
    const apolloClient = this.app.apolloProvider.defaultClient

    let article: any = {}

    await apolloClient
      .query({
        query: articleQuery,
        variables: {
          displayName: decodeURI(params.username),
          title: decodeURI(params.title),
        },
      })
      .then((articleFromGQL: any) => {
        article = articleFromGQL.data.article
      })
      .catch((e: any) => console.log(e))

    commit('SET', article)
  },
}

export const mutations: MutationTree<RootState> = {
  SET_LIST(state, payload: Array<Article>) {
    state.list = payload
  },
  SET(state, payload) {
    state.article = payload
  },
}

export const getters: GetterTree<RootState, RootState> = {
  publicArticlesAsCards(state): Array<ArticleCardInfo> {
    const articles: Array<object> = state.list.filter(
      (article) => article.currentVersion !== null
    )

    const articleCardInfoArray: Array<ArticleCardInfo> = []

    articles.forEach((article) => {
      articleCardInfoArray.push(new ArticleCardInfo(article))
    })

    return articleCardInfoArray
  },
}
