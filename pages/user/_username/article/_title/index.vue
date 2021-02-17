<template>
  <section>
    <div v-if="$fetchState.pending">loading...</div>
    <pre v-else>{{ article }}</pre>
  </section>
</template>

<script lang="ts">
import { defineComponent, useContext, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ArticleViewPage',
  setup() {
    const context = useContext()

    const params = context.params.value

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fetch, fetchState } = useFetch(
      async () => await context.store.dispatch('article/SHOW', { params })
    )
    const article = context.store.state.article.article

    return { article }
  },
})
</script>
