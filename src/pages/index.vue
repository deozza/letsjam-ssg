<template>
  <section>
    <BaseHeader html-type="h2">Les articles</BaseHeader>
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
} from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'
import BaseCard from '~/components/Molecules/Card/BaseCard.vue'
import articlesQuery from '~/apollo/queries/Article/articles.gql'
import ArticlesGql from '~/entities/Api/Article/ArticlesGql'
import BaseCardLoading from '~/components/Molecules/Card/BaseCardLoading.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    BaseHeader,
    BaseCard,
    BaseCardLoading
  },
  setup() {
    const context = useContext()
    const articles: Array<ArticleCardInfo> =[]

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: articlesQuery,
          prefetch: true,
        })
        .then((articlesFromGQL: any) => {
          const publicArticles: Array<ArticlesGql> = articlesFromGQL.data.articles
          publicArticles.forEach((publicArticle: ArticlesGql) => {
            const articleCardInfo: ArticleCardInfo = new ArticleCardInfo(publicArticle)
            articles.push(articleCardInfo)
          })
        })
        .catch((e: any) => console.log(e))
    })

    return { articles }
  },
})
</script>
