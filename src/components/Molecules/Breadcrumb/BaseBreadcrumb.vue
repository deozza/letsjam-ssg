<template>
  <ul>
    <li v-for="(link, key) in links" :key="key">
      <BaseLink :link="link">{{ link.title }}</BaseLink>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default defineComponent({
  name: 'BaseBreadcrumbVue',
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
ul {
  padding: 10px 16px;
  list-style: none;
  background-color: #eee;
}

ul li {
  display: inline;
  font-size: 18px;
}

ul li + li::before {
  padding: 8px;
  color: black;
  content: '/\00a0';
}

ul li a {
  color: #0275d8;
  text-decoration: none;
}

ul li a:hover {
  color: #01447e;
  text-decoration: underline;
}
</style>
