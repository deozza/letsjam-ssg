<template>
  <div
    itemscope
    itemtype="http://schema.org/Article"
    class="article-card flex-column flex-left"
  >
    <div class="card-header">
      <BaseLink itemprop="author" :link="article.authorLink">{{
        article.authorDisplayName
      }}</BaseLink>
      <BaseParagraph itemprop="datePublished">{{
        getDateFromTimestamp(article.dateOfLastUpdate)
      }}</BaseParagraph>
    </div>
    <div class="card-content">
      <BaseLink :link="article.articleLink">
        <BaseHeader itemprop="name" html-type="h3">{{
          article.title
        }}</BaseHeader>
      </BaseLink>
    </div>
    <div class="card-header card-footer">
      <div class="flex-row flex-between">
        <BaseParagraph class="p-footer"
          >{{ article.totalLikes }} <i class="far fa-heart"></i
        ></BaseParagraph>
        <BaseParagraph visual-type="light" class="article-tags">
          <BaseLink v-for="(tag, index) in article.tags" :key="index" :link="tag">{{tag.title}}</BaseLink>
        </BaseParagraph>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'

export default defineComponent({
  name: 'BaseCardVue',
  components: {
    BaseParagraph,
    BaseHeader,
    BaseLink,
  },
  props: {
    article: {
      type: Object as () => ArticleCardInfo,
      required: true,
    },
  },
  methods: {
    redirectToArticle() {
      this.$router.push(this.article.articleLink.link)
    },
    getDateFromTimestamp(timestamp: string) {
      const timestampAsNumber: number = +timestamp
      return new Date(timestampAsNumber).toLocaleString()
    },
  },
})
</script>

<style scoped>
div.article-card {
  background-color: white;
  padding: 12px 0;
  margin-bottom: 24px;
  border-radius: 3px;
  border: 1px solid var(--secondary_bg_hover);
}

div.article-card > div.card-content {
  padding: 0 58px;
  width: calc(100% - 116px);
}

div.article-card > div.card-header {
  padding-left: 24px;
}

div.article-card > div.card-footer {
  width: 95%;
}
div.article-card > div.card-content > a {
  text-decoration: none;
}

div.article-card > div.card-content > a :hover {
  color: var(--primary_text_hover) !important;
}

div.article-card > div.card-header > a,
div.article-card > div.card-footer > div.flex-row > p.article-tags > a.tag-link{
  text-decoration: none;
  color: black;
}

div.article-card > div.card-header > a:hover {
  color: var(--primary_text_hover);
}

div.article-card > div.card-footer > div.flex-row > p.article-tags > a.tag-link{
  margin-right: 12px;
}

@media only screen and (max-width: 1024px) {
  div.article-card > div.card-content {
    padding: 0 6px;
    width: calc(100% - 12px);
  }

  div.article-card > div.card-header {
    padding-left: 6px;
  }
}
</style>
