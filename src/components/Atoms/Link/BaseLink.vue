<template>
  <n-link
    v-if="link.internalLink === true"
    :to="link.link"
    :class="link.customClasses"
  >
    <i
      v-if="link.icon !== undefined && link.icon.length > 0"
      :class="link.icon"
    ></i>
    <slot></slot>
  </n-link>
  <a v-else :href="link.link" target="_blank" :class="link.customClasses">
    <i
      v-if="link.icon !== undefined && link.icon.length > 0"
      :class="link.icon"
    ></i>
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseLinkModele from './BaseLinkModele'

export default defineComponent({
  name: 'BaseLinkVue',
  props: {
    link: {
      type: Object as () => BaseLinkModele,
      required: true,
    },
  },
})
</script>
