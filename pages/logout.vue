<template>
  <div>
    <button @click="logout()">logout ?</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LogoutPage',
  methods: {
    async logout() {
      await this.$fire.auth.signOut()
      await this.$store.$router.push('/')
    },
  },
})
</script>
