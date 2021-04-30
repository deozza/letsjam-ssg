<template>
  <section>
    <section class="search">
      <form @submit.prevent="search()">
        <div class="flex-row flex-between">
          <input
            id="tag"
            v-model="tagsInput"
            type="text"
            class="input-text-title"
            required
            placeholder="Rechercher un article (séparez les catégories par une virgule)"
            name="Rechercher un article"
            minlength="3"
            maxlength="200"
          />
          <BaseButton html-type="submit" visual-type="primary" :loading="searchLoading" icon="fas fa-search" :only-icon="true"></BaseButton>
        </div>
      </form>
    </section>
    <section>
      <div class="flex-row flex-between">
        <BaseHeader html-type="h2">Les derniers articles</BaseHeader>
        <div class="flex-row flew-between articles-feed-mode" v-if="isLoggedIn">
          <span
            :class="[
              { 'selected': state.articleFeedMode === 'hot' },
            ]"
            v-on:click="changeFeedMode('hot')"
          >
            Hot
          </span>
          <span
            :class="[
              { 'selected': state.articleFeedMode === 'feed' },
            ]"
            v-on:click="changeFeedMode('feed')"
          >
            Feed
          </span>
        </div>
      </div>
      <div v-if="$fetchState.pending">
        <BaseCardLoading></BaseCardLoading>
        <BaseCardLoading></BaseCardLoading>
        <BaseCardLoading></BaseCardLoading>
        <BaseCardLoading></BaseCardLoading>

      </div>
      <div v-else>
        <BaseCard
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useFetch,
  ref
} from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'
import BaseCard from '~/components/Molecules/Card/BaseCard.vue'
import articlesQuery from '~/apollo/queries/Article/articles.gql'
import BaseCardLoading from '~/components/Molecules/Card/BaseCardLoading.vue'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import Profile from '~/entities/Front/User/Display/Profile'
import profileEditQuery from '~/apollo/queries/User/profileEdit.gql'
import ProfileGql from '~/entities/Api/User/ProfileGql'

export default defineComponent({
  name: 'IndexPage',
  components: {
    BaseHeader,
    BaseCard,
    BaseCardLoading,
    BaseButton
  },
  setup() {
    const context = useContext()
    const articles  = ref<ArticleCardInfo[]>([])
    const profile = ref<Profile>({} as Profile)
    const isLoggedIn: boolean = context.store.state.user.authUser.displayName.length > 0
    const searchLoading: boolean = false
    const tagsInput: string = ''

    const state = {
      articleFeedMode: 'hot'
    }

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: articlesQuery,
          prefetch: true,
        })
        .then((articlesFromGQL: any) => {
          const publicArticles: Array<ArticleGql> = articlesFromGQL.data.articles
          publicArticles.forEach((publicArticle: ArticleGql) => {
            if(publicArticle.currentVersion.state === ArticleVersionState.PUBLISHED){
              const articleCardInfo: ArticleCardInfo = new ArticleCardInfo(publicArticle)
              articles.value.push(articleCardInfo)
            }
          })
        })
        .catch((e: any) => console.log(e))

      if(isLoggedIn){
        await context.app.apolloProvider.defaultClient
          .query({
            query: profileEditQuery,
            prefetch: true,
            variables: {
              displayName: decodeURI(context.store.state.user.authUser.displayName),
            },
          })
          .then((profileFromGQL: any) => {
            const profileGql: ProfileGql = new ProfileGql(profileFromGQL.data.profile)
            profile.value = new Profile(profileGql)
            profile.value.tags.forEach(tag => tag.canRemove = true)
          })
          .catch((e: any) => console.log(e))
      }
    })

    return {
      articles,
      tagsInput,
      searchLoading,
      isLoggedIn,
      profile,
      state
    }
  },
  methods: {
    async search(){
      let searchQuery = ''

      this.tagsInput.split(',').forEach((tag, index) => {
        if(tag !== ''){
          searchQuery += encodeURI(tag.toLowerCase().replace(' ', '-'))
          searchQuery += '&'
        }
      })

      await this.$router.push('/search/'+searchQuery.slice(0,-1))
    },
    async changeFeedMode(mode: string){
      this.state.articleFeedMode = mode
      let variables = {}

      if(mode === 'feed'){

        variables = {
          tags: this.profile.tags.map(tag => tag.title)
        }
      }

      this.articles = []

      await this.$store.app.apolloProvider.defaultClient
        .query({
          query: articlesQuery,
          variables: variables,
          prefetch: true,
        })
        .then((articlesFromGQL: any) => {
          const publicArticles: Array<ArticleGql> = articlesFromGQL.data.articles

          publicArticles.forEach((publicArticle: ArticleGql) => {
            if(publicArticle.currentVersion.state === ArticleVersionState.PUBLISHED){
              const articleCardInfo: ArticleCardInfo = new ArticleCardInfo(publicArticle)
              this.articles.push(articleCardInfo)
            }
          })
        })
        .catch((e: any) => console.log(e))
    }
  }
})
</script>

<style scoped>
section.search {
  background-color: white;
  margin: 12px 0 48px 0;
  padding: 0 12px
}

input#tag {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  padding-left: 12px;
  width: 90%;
}

input#tag.input-text-title {
  font-size: 1em;
}

div.articles-feed-mode > span{
  margin-left: 12px
}

div.articles-feed-mode > span:hover {
  cursor: pointer;
}

div.articles-feed-mode > span.selected{
  font-weight: bold;
  border-bottom: 3px solid  var(--primary_bg);
}

@media only screen and (max-width: 1024px) {
  input#tag {
    width: 60%
  }
}
</style>
