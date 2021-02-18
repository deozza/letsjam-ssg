<template>
  <section>
    <BaseHeader html-type="h2">Les articles</BaseHeader>
    <div v-if="$fetchState.pending">loading</div>
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
  ref,
} from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'
import BaseCard from '~/components/Molecules/Card/BaseCard.vue'
import articlesQuery from '~/apollo/queries/Article/articles.gql'

export default defineComponent({
  name: 'IndexPage',
  components: {
    BaseHeader,
    BaseCard,
  },
  setup() {
    const context = useContext()
    const articles = ref([])

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: articlesQuery,
          prefetch: true,
        })
        .then((articlesFromGQL: any) => {
          const publicArticles = articlesFromGQL.data.articles.filter(
            (article) =>
              article.currentVersion !== null && article.currentVersion !== ''
          )
          publicArticles.forEach((publicArticle) => {
            articles.value.push(new ArticleCardInfo(publicArticle))
          })
        })
        .catch((e) => console.log(e))
    })

    return { articles }
  },
})
</script>
