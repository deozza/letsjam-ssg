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

export default defineComponent({
  name: 'LoginPage',
  components: {
    BaseHeader,
    BaseButton,
    BaseParagraph,
    BaseLink
  },
  setup() {
    const email: string = ''
    const password: string = ''
    const alert: BaseAlertModele = new BaseAlertModele('', '')
    const loginLoading: boolean = false
    const linkToSignin: BaseLinkModele = new BaseLinkModele(['signin'], 'Pas de compte ? En créer un.', true)

    return {
      email,
      password,
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
          this.email,
          this.password
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
