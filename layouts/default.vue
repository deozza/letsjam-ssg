<template>
  <div>
    <HorizontalNavbar
      v-if="isLoggedIn"
      :links="menuLinksLoggedIn"
      logo="Letsjam"
      theme="dark"
    />
    <HorizontalNavbar
      v-else
      :links="menuLinksAnonymous"
      logo="Letsjam"
      theme="dark"
    />
    <div class="content">
      <div class="horizontal-menu-content">
        <Nuxt />
      </div>
    </div>
    <BaseFooter
      v-if="isLoggedIn"
      theme="dark"
      copyright="letsjam"
      :links="menuLinksLoggedIn"
    ></BaseFooter>
    <BaseFooter
      v-else
      theme="dark"
      copyright="letsjam"
      :links="menuLinksAnonymous"
    ></BaseFooter>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
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
    const { store } = useContext()
    const menuLinksAnonymous: Array<BaseLinkModele> = [
      {
        link: '/login',
        title: 'Se connecter',
        customClasses: [],
        internalLink: true,
        icon: '',
        customLink: false,
      },
      {
        link: '/signin',
        title: 'Créer un compte',
        customClasses: [],
        internalLink: true,
        icon: '',
        customLink: false,
      },
    ]
    const menuLinksLoggedIn: Array<BaseLinkModele> = [
      {
        link: '/post',
        title: 'Ecrire un article',
        customClasses: [],
        internalLink: true,
        icon: 'fas fa-edit',
        customLink: false,
      },
      {
        link: '/profile',
        title: 'Mon compte',
        customClasses: [],
        internalLink: true,
        icon: 'fa fa-user',
        customLink: false,
      },
      {
        link: '/logout',
        title: 'Déconnection',
        customClasses: [],
        internalLink: true,
        icon: 'fas fa-power-off',
        customLink: false,
      },
    ]
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])

    return {
      menuLinksAnonymous,
      menuLinksLoggedIn,
      isLoggedIn,
    }
  },
})
</script>

<style scoped>
div div.content {
  min-height: calc(100vh - 72px);
}
</style>
