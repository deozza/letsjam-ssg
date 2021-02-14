<template>
  <section>
    <BaseHeader html-type="h2">Les articles</BaseHeader>
    <div v-if="$fetchState.pending">loading</div>
    <div v-else>
      <pre>{{ articles }}</pre>
    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import Article from '~/entities/Api/Article/Article'

export default defineComponent({
  name: 'IndexPage',
  components: {
    BaseHeader,
  },
  setup() {
    const { store } = useContext()

    useFetch(async () => await store.dispatch('article/GET'))

    const articles: Array<Article> = computed({
      get: (): Array<Article> => store.getters['article/publicArticlesAsCards'],
    })

    return {
      articles,
    }
  },
})
</script>
