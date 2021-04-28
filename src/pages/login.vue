<template>
  <section>
    <BaseHeader html-type="h2">Se connecter</BaseHeader>
    <form @submit.prevent="login">
      <div class="flex-column">
        <BaseParagraph v-if="alert.message !== ''" visual-type="danger">{{
          alert.message
        }}</BaseParagraph>
      </div>

      <ul>
        <BaseInput v-for="(input,index) in inputs" :key="index" :input="input"/>
      </ul>

      <div class="flex-column">
        <BaseButton
          html-type="submit"
          visual-type="success"
          :loading="loginLoading"
          >Continuer</BaseButton
        >
        <BaseLink :link="linkToSignin">{{linkToSignin.title}}</BaseLink>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import BaseAlertModele from '~/components/Atoms/Alert/BaseAlertModele'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseInput from '~/components/Atoms/Input/BaseInput.vue'
import BaseInputModele from '~/components/Atoms/Input/BaseInputModele'

export default defineComponent({
  name: 'LoginPage',
  components: {
    BaseHeader,
    BaseButton,
    BaseParagraph,
    BaseLink,
    BaseInput
  },
  setup() {
    const alert: BaseAlertModele = new BaseAlertModele('', '')
    const loginLoading: boolean = false
    const linkToSignin: BaseLinkModele = new BaseLinkModele(['signin'], 'Pas de compte ? En créer un.', true)

    const emailInput: BaseInputModele = new BaseInputModele('email', 'email', 'email', 'Email', true)
    const passwordInput: BaseInputModele = new BaseInputModele('password', 'password', 'password', 'Mot de passe', true)
    const inputs: Array<BaseInputModele> = {
      'email': emailInput,
      'password': passwordInput
    }

    return {
      inputs,
      alert,
      loginLoading,
      linkToSignin,
    }
  },
  methods: {
    async login() {
      this.loginLoading = true
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.inputs.email.value,
          this.inputs.password.value
        )
        await this.$router.push('/profile')
      } catch (firebaseError) {
        this.alert.message =
          'Impossible de se connecter. Les identifiants sont invalides'
      }

      this.loginLoading = false
    },
  },
})
</script>

<style scoped>
form {
  background-color: white;
  border: black solid 1px;
  border-radius: 7px;
}

form > div.flex-column > p {
  padding: 12px 0;
  text-align: center;
}

form div.flex-column a{
  padding: 12px 0;
}
</style>
