<template>
  <section>
    <BaseHeader html-type="h2">Mon profil</BaseHeader>
    <div class="flex-row flex-between">
      <section class="profile-info">
        <BaseHeader html-type="h3">{{user.displayName}}</BaseHeader>
        <BaseParagraph visual-type="light">Email : {{user.email}}</BaseParagraph>
        <BaseButton visual-type="primary" @buttonClicked="redirectToEditProfile()">Editer</BaseButton>
      </section>
      <section class="articles-posted">
        <BaseHeader html-type="h3">Mes articles</BaseHeader>
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    BaseHeader,
    BaseParagraph,
    BaseButton,
  },
  setup() {
    const context = useContext()
    const user = context.$fire.auth.currentUser

    return {
      user
    }
  },
  methods: {
    async redirectToEditProfile() {
      await this.$router.push('/profile/edit')
    },
  },
})
</script>

<style>
div.flex-row section {
  min-height: 50vh;
  background-color: white;
  padding: 12px;
}

div.flex-row section.profile-info {
  width: 20%;
}

div.flex-row section.profile-info button {
  margin-top: 24px;
  margin-left: 0;
}


div.flex-row section.articles-posted {
  width: 75%;
}
</style>


