<template>
  <img
    :src="src"
    :alt="alt"
    :style="cssVars"
    :class="[{ 'img-thumbnail': thumbnail }]"
    @click="actionOnClick()"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BaseImageVue',
  props: {
    src: {
      type: String as () => string,
      required: true,
    },
    alt: {
      type: String as () => string,
      required: true,
    },
    thumbnail: {
      type: Boolean as () => boolean,
      required: false,
      default: false,
    },
    maxWidth: {
      type: String as () => string,
      required: false,
      default: '100%',
    },
    action: {
      type: String as () => string,
      required: false,
      default: 'redirectTomage',
    },
  },
  setup({ maxWidth }) {
    const cssVars = ref({ '--max-width': maxWidth })
    return {
      cssVars,
    }
  },
  methods: {
    actionOnClick() {
      if (this.action !== 'redirectToImage') {
        this.$emit(this.action)
      } else {
        window.location.href = this.src
      }
    },
  },
})
</script>

<style scoped>
img {
  max-width: var(--max-width);
  width: 100%;
  height: auto;
}

img:hover {
  cursor: pointer;
}
img.img-thumbnail {
  border: 1px solid #ddd; /* Gray border */
  border-radius: 4px; /* Rounded border */
  padding: 5px; /* Some padding */
}
</style>
