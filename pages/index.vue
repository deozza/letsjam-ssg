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

<style>
div.article-tile {
  background-color: white;
  padding: 12px 0;
  margin-bottom: 24px;
  border-radius: 3px;
  border: 1px solid var(--secondary_bg_hover);
}

div.tags > p {
  padding: 12px;
  background-color: var(--secondary_bg);
}

div.article-tile > div.content {
  padding: 0 58px;
  width: calc(100% - 116px);
}

div.article-tile > div.header {
  padding-left: 24px;
}

div.article-tile > div.content > a {
  text-decoration: none;
}

div.article-tile > div.content > a :hover {
  color: var(--primary_text_hover) !important;
}

div.article-tile > div.header > a {
  text-decoration: none;
  color: black;
}

div.article-tile > div.header > a:hover {
  color: var(--primary_text_hover);
}

div.article-tile > div.content > div.tags > p {
  margin-top: 12px;
  margin-right: 12px;
}

div.article-tile > div.content > p.description {
  padding-bottom: 36px;
}

div.header div p.p-footer {
  padding-right: 12px;
}

@media only screen and (max-width: 1024px) {
  div.article-tile > div.content {
    padding: 0 6px;
    width: calc(100% - 12px);
  }

  div.article-tile > div.header {
    padding-left: 6px;
  }
}
</style>
