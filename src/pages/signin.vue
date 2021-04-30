<template>
  <section>
    <BaseHeader html-type="h2">Créer un compte</BaseHeader>
    <form @submit.prevent="signin">
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
          :loading="signinLoading"
          >Continuer</BaseButton
        >
        <BaseLink :link="linkToLogin">{{linkToLogin.title}}</BaseLink>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import BaseAlertModele from '~/components/Atoms/Alert/BaseAlertModele'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import User from '~/entities/Api/User/User'
import profileQuery from '~/apollo/queries/User/profile.gql'
import ProfileGql from '~/entities/Api/User/ProfileGql'
import Profile from '~/entities/Front/User/Display/Profile'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import ArticleCardInfoProfilePage from '~/entities/Front/Article/Display/ArticleCardInfoProfilePage'
import BaseInputModele from '~/components/Atoms/Input/BaseInputModele'
import BaseInput from '~/components/Atoms/Input/BaseInput.vue'

export default defineComponent({
  name: 'SigninPage',
  components: {
    BaseHeader,
    BaseButton,
    BaseParagraph,
    BaseLink,
    BaseInput
  },
  setup() {
    const alert: BaseAlertModele = new BaseAlertModele('', '')
    const signinLoading: boolean = false
    const linkToLogin: BaseLinkModele = new BaseLinkModele(['login'], 'Vous avez déjà un compte ? Connectez-vous', true)

    const emailInput: BaseInputModele = new BaseInputModele('email', 'email', 'email', 'Email', true)
    const displayNameInput: BaseInputModele = new BaseInputModele('text', 'displayName', 'displayName', 'Pseudo', true)
    const passwordInput: BaseInputModele = new BaseInputModele('password', 'password', 'password', 'Mot de passe', true)
    const repeatPasswordInput: BaseInputModele = new BaseInputModele('password', 'repeatPassword', 'repeatPassword', 'Confirmer le mot de passe', true)
    const inputs = {
      'email': emailInput,
      'displayName': displayNameInput,
      'password': passwordInput,
      'repeatPassword': repeatPasswordInput
    }

    return {
      inputs,
      alert,
      signinLoading,
      linkToLogin
    }
  },
  methods: {
    async signin() {
      this.alert.message = ''
      this.signinLoading = true

      await this.$store.app.apolloProvider.defaultClient
        .query({
          query: profileQuery,
          prefetch: true,
          variables: {
            displayName: this.inputs['displayName'].value,
          },
        })
        .then(() => {
          this.signinLoading = false
          this.alert.message =
            'Ce pseudo est déjà utilisé.'
        })
        .catch(() => {})

      if(this.alert.message !== ''){
        return
      }

      await this.$fire.auth.createUserWithEmailAndPassword(
        this.inputs['email'].value,
        this.inputs['password'].value
      ).then(result => {
        result.user?.updateProfile({displayName: this.inputs['displayName'].value})
        const user: User = new User({
          uid: result.user?.uid,
          displayName: this.inputs['displayName'].value,
          email: this.inputs['email'].value,
          active: true
        })
        this.$fire.firestore.collection('users').doc(result.user?.uid).set(user.toJSON())
      }).then(() => {
        this.$router.push('/')
      }).catch(firebaseError => {
        if(firebaseError.code === "auth/email-already-in-use"){
          this.alert.message =
            'Cet email est déjà utilisé.'
        }

        if(firebaseError.code === "auth/weak-password"){
          this.alert.message =
            'Le mot de passe doit comprendre 6 caractères minimum.'
        }
        this.signinLoading = false
      })
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

form div.flex-column p {
  padding: 12px 0;
  text-align: center;
}

form div.flex-column a{
  padding: 12px 0;
}

</style>
