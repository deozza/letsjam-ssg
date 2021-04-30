<template>
  <section>
    <BaseHeader html-type="h2">Editer mon profil</BaseHeader>

    <section>
      <BaseHeader html-type="h3">Vos infos : </BaseHeader>

      <BaseParagraph visual-type="danger" v-if="state.displayNameError !== ''">{{displayNameError}}</BaseParagraph>
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
        <BaseButton html-type="submit" visual-type="success" @buttonClicked="editDisplayName(newDisplayName)" :loading="state.updateDisplayNameLoading">Editer le pseudo</BaseButton>
      </div>
      <BaseParagraph visual-type="danger" v-if="state.emailError !== ''">{{emailError}}</BaseParagraph>

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
        <BaseButton html-type="submit" visual-type="success" @buttonClicked="editEmail(newEmail)" :loading="state.updateEmailLoading">Changer d'email</BaseButton>
      </div>
    </section>
    <section class="tags">
        <div class="flex-column flex-left">
          <BaseHeader html-type="h3">Vos centres d'intérêts : </BaseHeader>

          <div class="flex-row flex-left selected-tags" style="width: 100%">
            <BaseTag v-for="(tag, index) in profile.tags" :key="tag.title" :tag="tag" v-on:tagClick="removeTag($event)" />
          </div>

          <div class="flex-row flex-between manual-input-container">
            <input
              id="tag"
              v-model="newTag"
              type="text"
              class="add-tag-manually"
              required
              placeholder="Nouveau centre"
              name="Nouveau centre"
              minlength="1"
              maxlength="200"
            />
            <BaseButton
              html-type="button"
              visual-type="primary"
              :disabled="state.maxTagsLengthReached"
              icon="fas fa-plus"
              @buttonClicked="addManualTag(newTag, true)"
            >Ajouter</BaseButton
            >
          </div>
          <div >
            <BaseParagraph visual-type="light">Propositions de centres d'intérêts :</BaseParagraph>
            <div class="flex-row flex-left">
              <BaseTag v-for="(tag, index) in tagsPresetLeft" :key="index" :tag="tag" v-on:tagClick="addTag($event)" />
            </div>
          </div>
        </div>
    </section>
  </section>

</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import User from '~/entities/Api/User/User'
import BaseCardLoading from '~/components/Molecules/Card/BaseCardLoading.vue'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import profileEditQuery from '~/apollo/queries/User/profileEdit.gql'
import ProfileGql from '~/entities/Api/User/ProfileGql'
import Profile from '~/entities/Front/User/Display/Profile'
import tagsQuery from '~/apollo/queries/Tags/tags.gql'
import BaseTagModele from '~/components/Atoms/Tag/BaseTagModele'
import BaseTag from '~/components/Atoms/Tag/BaseTag.vue'

export default defineComponent({
  name: 'ProfileEditPage',
  components: {
    BaseHeader,
    BaseCardLoading,
    BaseButton,
    BaseParagraph,
    BaseTag
  },
  middleware: 'authenticated',
  setup() {
    const context = useContext()
    const user: User = context.store.state.user.authUser
    const newDisplayName: string = user.displayName
    const newEmail: string = user.email
    const newTag: string = ''
    const tagsPreset = ref<Array<BaseTagModele>>([])
    const tagsPresetLeft = ref<Array<BaseTagModele>>([])
    const profile = ref<Profile>({} as Profile)

    const state = {
      updateDisplayNameLoading: false,
      displayNameError: '',
      updateEmailLoading: false,
      emailError: '',
      maxTagsLengthReached: false
    }

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: tagsQuery,
          prefetch: true
        })
        .then((tagsFromGQL: any) => {
          tagsFromGQL.data.tags.forEach((tagFromGql: any) => {

            const tag: BaseTagModele = new BaseTagModele(tagFromGql.name, true)

            tagsPreset.value.push(tag)
            tagsPresetLeft.value.push(tag)
          })
        })
        .catch((e: any) => console.log(e))

      await context.app.apolloProvider.defaultClient
        .query({
          query: profileEditQuery,
          prefetch: true,
          variables: {
            displayName: decodeURI(newDisplayName),
          },
        })
        .then((profileFromGQL: any) => {
          const profileGql: ProfileGql = new ProfileGql(profileFromGQL.data.profile)
          profile.value = new Profile(profileGql)
          profile.value.tags.forEach(tag => tag.canRemove = true)
          state.maxTagsLengthReached = profile.value.tags.length > 10
        })
        .catch((e: any) => console.log(e))
    })

    return {
      user,
      newDisplayName,
      newEmail,
      newTag,
      tagsPreset,
      tagsPresetLeft,
      state,
      profile
    }
  },
  methods: {
    async editDisplayName(displayName: string){
      if(displayName === this.user.displayName){
        this.displayNameError = "Modifiez votre pseudo avant de cliquer !"
        return
      }

      this.state.displayNameError = ''

      this.state.updateDisplayNameLoading = true

      try{
        const alreadyExist = await this.$fire.firestore.collection('users')
          .where('displayName', '==', displayName)
          .where('uid', '!=', this.user.uid)
          .get()

        if(alreadyExist.docs.length > 0){
          this.state.displayNameError = "Ce pseudo est déjà utilisé."
          this.state.updateDisplayNameLoading = false
          return
        }
        const userRef = this.$fire.firestore
          .collection('users')
          .doc(this.user.uid)

        await userRef.update({displayName: displayName})

        await this.$fire.auth.currentUser?.updateProfile({displayName: displayName})
        this.state.updateDisplayNameLoading = false
      }catch(e){
        this.state.updateDisplayNameLoading = false
      }
    },
    async editEmail(email: string){
      if(email === this.user.email){
        this.state.emailError = "Modifiez votre pseudo avant de cliquer !"
        return
      }
      this.state.emailError = ""
      this.state.updateEmailLoading = true

      try{
        await this.$fire.auth.currentUser?.updateEmail(email)
        await this.$fire.firestore
          .collection('users')
          .doc(this.user.uid)
          .update({email: email})
        this.state.updateEmailLoading = false

      }catch (e) {
        this.state.emailError = "Cet email est déjà utilisé."
        this.state.updateEmailLoading = false
      }
    },
    addManualTag(tagName: string){
      if(tagName.length < 3){
        return
      }
      const tag: BaseTagModele = new BaseTagModele(tagName, false, true)

      this.addTag(tag)

    },
    async addTag(tag: BaseTagModele){
      if(this.profile.tags.length >= 10 || this.state.maxTagsLengthReached){
        this.state.maxTagsLengthReached = true
        return
      }

      this.profile.tags.push(tag)

      const userRef = this.$fire.firestore
        .collection('users')
        .doc(this.user.uid)

      await userRef
        .update({tags: this.profile.tags.map(tag => tag.title)})
        .then(() => {
          this.newTag = ''
          this.state.maxTagsLengthReached = this.profile.tags.length >= 10
        })
        .catch((e) => {
        })
    },
    async removeTag(tag: BaseTagModele){
      this.profile.tags.splice(this.profile.tags.indexOf(tag), 1)

      const userRef = this.$fire.firestore
        .collection('users')
        .doc(this.user.uid)

      await userRef
        .update({tags: this.profile.tags.map(tag => tag.title)})
        .then(() => {
          this.newTag = ''

        })
        .catch((e) => {
        })
    },
  }
})
</script>

<style scoped>
section section {
  background-color: white;
  margin: 12px 0;
  padding: 12px
}
input#title, input#tags {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  padding-left: 12px;
  width: auto;
}

input#title.input-text-title {
  font-size: 2em;
}

input#tags.input-text-title {
  font-size: 1.175rem;
}

div.flex-row.flex-left.selected-tags{
  align-items: center;
}
input {
  padding: 12px;
  width: 65%
}

section.tags > div.flex-column > div{
  margin: 12px 0;
}
</style>
