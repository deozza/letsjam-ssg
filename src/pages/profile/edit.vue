<template>
  <section>
    <BaseHeader html-type="h2">Editer mon profil</BaseHeader>
  </section>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'

export default defineComponent({
  name: 'ProfileEditPage',
  components: {
    BaseHeader,
  },
  setup() {
    const context = useContext()
    const user = context.$fire.auth.currentUser

    return {
      user
    }
  }
})
</script>
