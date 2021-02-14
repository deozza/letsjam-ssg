<template>
  <div
    itemscope
    itemtype="http://schema.org/Article"
    class="article-tile flex-column flex-left"
  >
    <div class="header">
      <BaseLink itemprop="author" :link="card.author">{{
        card.author.title
      }}</BaseLink>
      <BaseParagraph itemprop="datePublished">{{ card.date }}</BaseParagraph>
    </div>
    <div class="content">
      <BaseLink :link="card.title">
        <BaseHeader itemprop="name" html-type="h3">{{
          card.title.title
        }}</BaseHeader>
      </BaseLink>
      <BaseParagraph :class="'description'">{{
        card.description
      }}</BaseParagraph>

      <div class="flex-row">
        <BaseVideo
          v-if="card.video !== undefined && card.video !== null"
          :alt="card.video.alt"
          :src="card.video.src"
          :iframe="card.video.iframe"
        />
        <BaseImage
          v-if="card.image !== undefined && card.image !== null"
          :alt="card.image.alt"
          :src="card.image.src"
          thumbnail
          action="redirectToArticle"
          @redirectToArticle="redirectToArticle"
        />
      </div>

      <div class="tags flex-row flex-left">
        <BaseParagraph
          v-for="(tag, index) in card.tags"
          :key="index"
          itemprop="articleSection"
          >{{ tag }}</BaseParagraph
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseCardModele from '~/components/Molecules/Card/BaseCardModele'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseVideo from '~/components/Atoms/Media/Video/BaseVideo.vue'

export default defineComponent({
  name: 'BaseCardVue',
  components: {
    BaseHeader,
    BaseParagraph,
    BaseLink,
    BaseVideo,
  },
  props: {
    card: {
      type: Object as () => BaseCardModele,
      required: true,
    },
  },
  methods: {
    redirectToArticle() {
      window.location.href = this.card.title.link
    },
  },
})
</script>

<style scoped>
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
