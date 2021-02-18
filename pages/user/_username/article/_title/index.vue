<template>
  <section>
    <div v-if="$fetchState.pending">loading...</div>
    <div
      v-else
      itemscope
      itemtype="http://schema.org/Article"
      class="article-tile border"
    >
      <BaseHeader itemprop="name" html-type="h2">{{
        article.title
      }}</BaseHeader>
      <div class="header">
        <BaseParagraph itemprop="datePublished"
          >Le
          {{ getDateFromTimestamp(article.dateOfLastUpdate) }}</BaseParagraph
        >
      </div>
      <div
        itemprop="articleBody"
        class="content"
        v-html="$md.render(article.currentVersion.content)"
      />
      <div class="header">
        <div class="flex-row flex-left">
          <BaseParagraph class="p-footer"
            >{{ article.totalViews }} <i class="far fa-eye"></i
          ></BaseParagraph>
          <BaseParagraph class="p-footer"
            >{{ article.totalLikes }} <i class="far fa-heart"></i
          ></BaseParagraph>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, useContext, useFetch } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'

export default defineComponent({
  name: 'ArticleViewPage',
  components: {
    BaseHeader,
    BaseLink,
    BaseParagraph,
  },
  setup() {
    const context = useContext()
    const params = context.params.value

    useFetch(async () => {
      await context.store.dispatch('article/SHOW', { params })
    })
    const article = context.store.state.article.article

    return { article }
  },
  methods: {
    getDateFromTimestamp(timestamp: string) {
      const timestampAsNumber: number = +timestamp
      return new Date(timestampAsNumber).toLocaleString()
    },
  },
})
</script>

<style>
div.article-tile {
  background-color: white;
  padding: 12px 24px;
  margin-bottom: 24px;
  border-radius: 3px;
}

div.article-tile.border {
  border: 1px solid var(--secondary_bg_hover);
}

div.article-tile > div.header > a {
  text-decoration: none;
  color: black;
}

div.header div p.p-footer {
  padding-right: 12px;
}

div.content {
  padding-top: 24px;
}

div.content > h2 {
  padding-bottom: 12px;
  font-size: 1.75rem;
}

div.content > p {
  padding-bottom: 24px;
}

div.content > p > em {
  font-style: italic;
}

div.content > p > strong {
  font-weight: bold;
}

div.content > ul,
div.content > ol {
  padding-bottom: 24px;
}

div.content > ul > li {
  list-style: inside;
}
</style>
