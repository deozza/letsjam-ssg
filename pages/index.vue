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
import { defineComponent, useContext, useFetch } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'
import BaseCard from '~/components/Molecules/Card/BaseCard.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    BaseHeader,
    BaseCard,
  },
  setup() {
    const context = useContext()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useFetch(async () => await context.store.dispatch('article/GET'))
    const articles: Array<ArticleCardInfo> =
      context.store.getters['article/publicArticlesAsCards']

    return { articles }
  },
})
</script>
