<template>
  <iframe
    v-if="iframe === true"
    :src="src"
    :alt="alt"
    height="315"
    width="560"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>

  <video v-else :src="src" :alt="alt" controls></video>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BaseVideoVue',
  props: {
    src: {
      type: String as () => string,
      required: true,
    },
    alt: {
      type: String as () => string,
      required: true,
    },
    iframe: {
      type: Boolean as () => boolean,
      required: false,
      default: false,
    },
  },
})
</script>
