<template>
  <section>
    <BaseHeader html-type="h2">Les articles</BaseHeader>
    <div v-if="$apollo.loading">loading</div>
    <div v-else>
      <div v-for="(article, index) in articles" :key="index">
        <div
          itemscope
          itemtype="http://schema.org/Article"
          class="article-tile flex-column flex-left"
        >
          <div class="header">
            <a href="">
              {{ article.user.displayName }}
            </a>
            <BaseParagraph itemprop="datePublished">{{
              getDateFromTimestamp(article.dateOfLastUpdate)
            }}</BaseParagraph>
          </div>
          <div class="content">
            <a href="">
              <BaseHeader itemprop="name" html-type="h3">{{
                article.title
              }}</BaseHeader>
            </a>
          </div>
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
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import articles from '~/apollo/queries/Article/articles.gql'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    BaseHeader,
    BaseParagraph,
  },
  apollo: {
    articles: {
      query: articles,
    },
  },
  data() {
    return {
      articles: [],
    }
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
