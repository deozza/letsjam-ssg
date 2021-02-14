<template>
  <div
    itemscope
    itemtype="http://schema.org/Article"
    class="article-tile"
    :class="[{ border: !fromEditor }]"
  >
    <BaseHeader itemprop="name" html-type="h2">{{ article.title }}</BaseHeader>
    <div class="header">
      <BaseLink itemprop="author" :link="authorLink"
        >De {{ authorLink.title }}</BaseLink
      >
      <BaseParagraph itemprop="datePublished"
        >Le
        {{ new Date(article.dateOfLastUpdate).toLocaleString() }}</BaseParagraph
      >
    </div>
    <BaseArticleViewer itemprop="articleBody" :content="article.content" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseArticleViewer from '~/components/Atoms/Article/BaseArticleViewer.vue'
import ArticlePage from '~/entities/Front/Article/Display/ArticlePage'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default defineComponent({
  name: 'BaseArticleVue',
  components: {
    BaseLink,
    BaseHeader,
    BaseParagraph,
    BaseArticleViewer,
  },
  props: {
    article: {
      type: Object as () => ArticlePage,
      required: true,
    },
    authorLink: {
      type: Object as () => BaseLinkModele,
      required: true,
    },
    fromEditor: {
      type: Boolean as () => boolean,
      required: false,
      default: false,
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
</style>
