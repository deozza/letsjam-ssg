<template>
  <section>
    <div class="flex-column">
      <BaseHeader html-type="h2">Vous voulez vraiment nous quitter ?</BaseHeader>
      <BaseButton
        html-type="button"
        visual-type="primary"
        icon="fas fa-power-off"
        v-on:buttonClicked="logout"
      >Oui mais je reviendrais !</BaseButton>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'

export default defineComponent({
  name: 'LogoutPage',
  components: {
    BaseHeader,
    BaseButton
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut()
      await this.$store.$router.push('/')
    },
  },
})
</script>
