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
        <li class="flex-column">
          <div class="flex-row input-row">
            <label for="email">
              Email<span class="required-field">*</span>
            </label>

            <input
              id="email"
              v-model="email"
              type="email"
              required
              name="email"
            />
          </div>
        </li>
        <li class="flex-column">
          <div class="flex-row input-row">
            <label for="displayName">
              Pseudo<span class="required-field">*</span>
            </label>

            <input
              id="displayName"
              v-model="displayName"
              type="text"
              required
              name="displayName"
            />
          </div>
        </li>
        <li class="flex-column">
          <div class="flex-row input-row">
            <label for="password">
              Mot de passe<span class="required-field">*</span>
            </label>

            <input
              id="password"
              v-model="password"
              type="password"
              required
              name="password"
            />
          </div>
        </li>
        <li class="flex-column">
          <div class="flex-row input-row">
            <label for="repeatPassword">
              Répéter le mot de passe<span class="required-field">*</span>
            </label>

            <input
              id="repeatPassword"
              v-model="repeatPassword"
              type="password"
              required
              name="repeatPassword"
            />
          </div>
        </li>
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

export default defineComponent({
  name: 'SigninPage',
  components: {
    BaseHeader,
    BaseButton,
    BaseParagraph,
    BaseLink
  },
  setup() {
    const email: string = ''
    const displayName: string = ''
    const password: string = ''
    const repeatPassword: string = ''
    const alert: BaseAlertModele = new BaseAlertModele('', '')
    const signinLoading: boolean = false
    const linkToLogin: BaseLinkModele = new BaseLinkModele(['login'], 'Vous avez déjà un compte ? Connectez-vous', true)

    return {
      email,
      displayName,
      password,
      repeatPassword,
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
            displayName: this.displayName,
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
        this.email,
        this.password
      ).then(result => {
        result.user?.updateProfile({displayName: this.displayName})
        const user: User = new User({
          uid: result.user?.uid,
          displayName: this.displayName,
          email: this.email,
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

form > ul > li > div {
  padding: 0.5em;
  align-items: normal;
}

form > ul > li > div > label {
  flex: 1;
  padding: 0.5em 1em 0.5em 0;
}

form > ul > li > div > input,
form > ul > li > div > select {
  flex: 2;
}

form > ul > li > div > label span.required-field {
  margin-left: 6px;
  color: var(--danger_text);
}

form ul li div.input-row {
  width: 98%;
}

form div.flex-column a{
  padding: 12px 0;
}

@media screen and (max-width: 760px) {
  form ul li .flex-row {
    flex-direction: column;
  }
}
</style>
