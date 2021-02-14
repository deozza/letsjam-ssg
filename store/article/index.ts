import { ActionTree, MutationTree, GetterTree } from 'vuex'
import Article from '~/entities/Api/Article/Article'

export type State = {
  list: Array<Article>
}

export const state = (): State => ({
  list: [],
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
}

export const mutations: MutationTree<RootState> = {
  SET_LIST(state, payload: Array<Article>) {
    state.list = payload
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
