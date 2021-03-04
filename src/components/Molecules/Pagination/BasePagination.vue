<template>
  <div>
    <BaseLink v-for="(link, index) in links" :key="index" :link="link">{{
      link.title
    }}</BaseLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default defineComponent({
  name: 'BasePaginationVue',
  components: {
    BaseLink,
  },
  props: {
    links: {
      type: Array as () => Array<BaseLinkModele>,
      required: true,
    },
  },
})
</script>

<style scoped>
div {
  display: inline-block;
}

div a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
}

div a.active {
  background-color: #4caf50;
  color: white;
}

div a:hover {
  background-color: #ddd;
}
</style>
