<template>
  <section>
    <BaseHeader html-type="h2">Les articles écrits par {{displayName}}</BaseHeader>
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
import articlesOfUserQuery from '~/apollo/queries/Article/articlesOfUser.gql'
import BaseCardLoading from '~/components/Molecules/Card/BaseCardLoading.vue'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'

export default defineComponent({
  name: 'ArticlesOfUserPage',
  components: {
    BaseHeader,
    BaseCard,
    BaseCardLoading
  },
  setup() {
    const context = useContext()
    const params = context.params.value
    const articles  = ref<ArticleCardInfo[]>([])
    const displayName: string = params.username

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: articlesOfUserQuery,
          prefetch: true,
          variables: {
            displayName: decodeURI(params.username),
          },
        })
        .then((articlesFromGQL: any) => {
          const publicArticles: Array<ArticleGql> = articlesFromGQL.data.articlesOfUser

          publicArticles.forEach((publicArticle: ArticleGql) => {
            if(publicArticle.currentVersion.state === ArticleVersionState.PUBLISHED){
              const articleCardInfo: ArticleCardInfo = new ArticleCardInfo(publicArticle)
              articles.value.push(articleCardInfo)
            }
          })
        })
        .catch((e: any) => console.log(e))
    })

    return { articles, displayName }
  },
})
</script>
