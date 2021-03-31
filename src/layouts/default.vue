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

    const loginLink: BaseLinkModele = new BaseLinkModele(
      ['login'],
      'Se connecter',
      true
    )
    const signinLink: BaseLinkModele = new BaseLinkModele(
      ['signin'],
      'Créer un compte',
      true
    )

    const menuLinksAnonymous: Array<BaseLinkModele> = [loginLink, signinLink]

    const postLink: BaseLinkModele = new BaseLinkModele(
      ['post'],
      'Ecrire un article',
      true,
      'fas fa-edit'
    )
    const profileLink: BaseLinkModele = new BaseLinkModele(
      ['profile'],
      'Mon compte',
      true,
      'fa fa-user'
    )
    const logoutLink: BaseLinkModele = new BaseLinkModele(
      ['logout'],
      'Déconnection',
      true,
      'fas fa-power-off'
    )

    const menuLinksLoggedIn: Array<BaseLinkModele> = [
      postLink,
      profileLink,
      logoutLink,
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
