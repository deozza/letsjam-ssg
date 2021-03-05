<template>
  <div class="content" v-html="$md.render(content)" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BaseArticleViewerVue',
  props: {
    content: {
      type: String as () => string,
      required: true,
    },
  },
})
</script>

<style>
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
