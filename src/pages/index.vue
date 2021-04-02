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
          <BaseButton html-type="submit" visual-type="primary"  :loading="searchLoading" icon="search" :only-icon="true"></BaseButton>
        </div>
      </form>
    </section>
    <BaseHeader html-type="h2">Les derniers articles</BaseHeader>
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
    const searchLoading: boolean = false
    const tagsInput: string = ''

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
    })

    return {
      articles,
      tagsInput,
      searchLoading
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
    }
  }
})
</script>

<style>
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
</style>
