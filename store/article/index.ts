import { ActionTree, MutationTree, GetterTree } from 'vuex'
import Article from '~/entities/Api/Article/Article'
import articleQuery from '~/apollo/queries/Article/article.gql'

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
    const articles: Array<Article> = []

    const articlesQuery = this.$fire.firestore
      .collection('articles')
      .orderBy('dateOfLastUpdate', 'desc')
    try {
      const snap = await articlesQuery.get()
      if (!snap.empty) {
        snap.forEach((doc) => {
          const article = new Article(doc.data())
          articles.push(article)
        })
      }
    } catch (error) {
      console.log(error)
    }

    commit('SET_LIST', articles)
  },
  async SHOW({ commit }, { params }) {
    const apolloClient = this.app.apolloProvider.defaultClient

    let article = {}

    try {
      article = await apolloClient.query({
        query: articleQuery,
        variables: { displayName: params.username, title: params.title },
      })
    } catch (e) {
      console.log(e)
    }

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
  publicArticlesAsCards(state): Array<Article> {
    const articles: Array<Article> = state.list.filter(
      (article) => article.title !== null
    )
    return articles
  },
}
