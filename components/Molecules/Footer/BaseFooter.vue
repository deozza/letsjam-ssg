<template>
  <footer :class="[{ [`footer-${theme}`]: theme }]">
    <div class="flex-column">
      <div class="flex-row flex-around">
        <BaseLink v-for="(link, index) of links" :key="index" :link="link">{{
          link.title
        }}</BaseLink>
      </div>
      <small>{{ copyright }}</small>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default defineComponent({
  name: 'BaseFooterVue',
  components: {
    BaseLink,
  },
  props: {
    theme: {
      type: String as () => string,
      required: true,
    },
    copyright: {
      type: String as () => string,
      required: true,
    },
    links: {
      type: Array as () => Array<BaseLinkModele>,
      required: true,
    },
  },
})
</script>

<style scoped>
footer > div {
  height: 72px;
}
footer > div > div {
  width: 100%;
}

footer.footer-light {
  background-color: white;
  border-right: 1px solid black;
}

footer.footer-light > div > div > a,
footer.footer-light > div > div > i,
footer.footer-light > div > small {
  color: black;
}

footer.footer-dark {
  background-color: black;
}

footer.footer-dark > div > div > a,
footer.footer-dark > div > div > i,
footer.footer-dark > div > small {
  color: white;
}
</style>
