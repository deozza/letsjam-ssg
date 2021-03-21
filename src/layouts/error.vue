<template>
    <div class="content">
      <div class="horizontal-menu-content">
        <h1 v-if="error.statusCode === 404">Cette page n'existe pas ...</h1>
        <h1 v-else>Une erreur est survenue - {{ error.statusCode }}</h1>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import BaseLinkModele from '../components/Atoms/Link/BaseLinkModele'
import HorizontalNavbar from '~/components/Molecules/Menu/HorizontalNavbar.vue'
import BaseFooter from '~/components/Molecules/Footer/BaseFooter.vue'

export default defineComponent({
  name: 'ErrorLayoutVue',
  components: {
    HorizontalNavbar,
    BaseFooter,
  },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
})
</script>
