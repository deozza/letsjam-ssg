<template>
  <div>
    <HorizontalNavbar :links="menuLinks" logo="Letsjam" theme="dark" />
    <div class="content">
      <div class="horizontal-menu-content">
        <Nuxt />
      </div>
    </div>
    <BaseFooter
      theme="dark"
      copyright="letsjam"
      :links="menuLinks"
    ></BaseFooter>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseLinkModele from '../components/Atoms/Link/BaseLinkModele'
import HorizontalNavbar from '~/components/Molecules/Menu/HorizontalNavbar.vue'
import BaseFooter from '~/components/Molecules/Footer/BaseFooter.vue'

export default defineComponent({
  name: 'DefaultLayoutVue',
  components: {
    HorizontalNavbar,
    BaseFooter,
  },
  setup() {
    const menuLinks: Array<BaseLinkModele> = []

    menuLinks.push({
      link: '/login',
      title: 'Se connecter',
      customClasses: [],
      internalLink: true,
      icon: '',
      customLink: false,
    })

    menuLinks.push({
      link: '/signin',
      title: 'Créer un compte',
      customClasses: [],
      internalLink: true,
      icon: '',
      customLink: false,
    })

    return {
      menuLinks,
    }
  },
})
</script>

<style scoped>
div div.content {
  min-height: calc(100vh - 72px);
}
</style>
