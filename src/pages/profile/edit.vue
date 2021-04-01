<template>
  <section>
    <BaseHeader html-type="h2">Editer mon profil</BaseHeader>

    <section>
      <BaseParagraph visual-type="danger" v-if="displayNameError !== ''">{{displayNameError}}</BaseParagraph>
      <div class="flex-row flex-between">
        <input
          id="displayName"
          v-model="newDisplayName"
          type="text"
          class="input-text-title"
          required
          placeholder="Titre de votre article"
          name="Titre de votre article"
          minlength="10"
          maxlength="200"
        />
        <BaseButton html-type="submit" visual-type="success" @buttonClicked="editDisplayName(newDisplayName)" :loading="updateDisplayNameLoading">Editer le pseudo</BaseButton>
      </div>
    </section>
    <section>
      <BaseParagraph visual-type="danger" v-if="emailError !== ''">{{emailError}}</BaseParagraph>

      <div class="flex-row flex-between">
        <input
          id="email"
          v-model="newEmail"
          type="email"
          class="input-text-title"
          required
          placeholder="Titre de votre article"
          name="Titre de votre article"
          minlength="10"
          maxlength="200"
        />
        <BaseButton html-type="submit" visual-type="success" @buttonClicked="editEmail(newEmail)" :loading="updateEmailLoading">Changer d'email</BaseButton>
      </div>
    </section>
  </section>

</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import User from '~/entities/Api/User/User'
import BaseCardLoading from '~/components/Molecules/Card/BaseCardLoading.vue'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'

export default defineComponent({
  name: 'ProfileEditPage',
  components: {
    BaseHeader,
    BaseCardLoading,
    BaseButton,
    BaseParagraph
  },
  setup() {
    const context = useContext()
    const user: User = context.store.getters['user/loggedUser']
    const updateDisplayNameLoading: boolean = false
    const updateEmailLoading: boolean = false
    const newDisplayName: string = user.displayName
    const newEmail: string = user.email
    const displayNameError: string = ''
    const emailError: string = ''

    return {
      user,
      newDisplayName,
      newEmail,
      updateDisplayNameLoading,
      updateEmailLoading,
      displayNameError,
      emailError
    }
  },
  methods: {
    async editDisplayName(displayName: string){
      if(displayName === this.user.displayName){
        this.displayNameError = "Modifiez votre pseudo avant de cliquer !"
        return
      }

      this.displayNameError = ''

      this.updateDisplayNameLoading = true

      try{
        const alreadyExist = await this.$fire.firestore.collection('users')
          .where('displayName', '==', displayName)
          .where('uid', '!=', this.user.uid)
          .get()

        if(alreadyExist.docs.length > 0){
          this.displayNameError = "Ce pseudo est déjà utilisé."
          this.updateDisplayNameLoading = false
          return
        }
        const userRef = this.$fire.firestore
          .collection('users')
          .doc(this.user.uid)

        await userRef.update({displayName: displayName})

        await this.$fire.auth.currentUser?.updateProfile({displayName: displayName})
        this.updateDisplayNameLoading = false
      }catch(e){
        this.updateDisplayNameLoading = false
      }
    },
    async editEmail(email: string){
      if(email === this.user.email){
        this.emailError = "Modifiez votre pseudo avant de cliquer !"
        return
      }
      this.emailError = ""
      this.updateEmailLoading = true

      try{
        await this.$fire.auth.currentUser?.updateEmail(email)
        await this.$fire.firestore
          .collection('users')
          .doc(this.user.uid)
          .update({email: email})
        this.updateEmailLoading = false

      }catch (e) {
        this.emailError = "Cet email est déjà utilisé."
        this.updateEmailLoading = false
      }
    }
  }
})
</script>
