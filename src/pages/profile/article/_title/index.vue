<template>
  <section v-if="$fetchState.pending">
    <BaseArticleLoading></BaseArticleLoading>
  </section>
  <section v-else>
    <BaseHeader html-type="h2">Editer l'article</BaseHeader>
    <section class="content">
      <section>
        <div class="flex-row flex-between">
          <input
            id="title"
            v-model="article.title"
            type="text"
            class="input-text-title"
            required
            placeholder="Titre de votre article"
            name="Titre de votre article"
            minlength="10"
            maxlength="200"
          />
          <BaseButton v-if="!article.allVersionsAreArchived" html-type="submit" visual-type="success" @buttonClicked="updateTitle()" :loading="updateTitleLoading">Editer le titre</BaseButton>
        </div>
      </section>

      <section class="publishedVersion" v-if="article.publishedVersion !== null">
        <BaseHeader html-type="h3">Version en ligne :</BaseHeader>
        <textarea
          v-model="article.publishedVersion.content"
          name="editor"
          placeholder="Ecrire ici votre article"
        ></textarea>
        <BaseButton v-if="article.lastVersion === null" visual-type="success" @buttonClicked="newArticleVersion()" :loading="newArticleVersionLoading">Modifier l'article</BaseButton>
      </section>

      <section class="lastVersion" v-if="article.lastVersion !== null">
        <BaseHeader html-type="h3">Dernière version : <span v-html="article.lastVersion.stateIcon"></span></BaseHeader>
        <div
          v-if="article.lastVersion.state === 'MODERATED'"
        >
          <textarea
            v-model="article.lastVersion.content"
            name="editor"
            placeholder="Ecrire ici votre article"
          ></textarea>
          <BaseButton visual-type="success" @buttonClicked="updateLastVersion()" :loading="updateLastVersionLoading">Corriger l'article</BaseButton>
        </div>

        <div
          v-else
          itemprop="articleBody"
          class="article-content"
          v-html="$md.render(article.lastVersion.content)"
        />
      </section>

      <section class="draftVersion" v-if="article.draftVersion !== null">
        <BaseHeader html-type="h3">Brouillon :</BaseHeader>
        <textarea
          v-model="article.draftVersion.content"
          name="editor"
          placeholder="Ecrire ici votre article"
        ></textarea>
        <div class="flex-row flex-around">
          <BaseButton visual-type="warning" @buttonClicked="updateDraft()" :loading="updateDraftLoading">Modifier le brouillon</BaseButton>
          <BaseButton visual-type="success" @buttonClicked="publishDraft()" :loading="publishDraftLoading">Mettre en ligne l'article</BaseButton>
        </div>
      </section>

      <section class="olderVersions" v-if="article.olderVersions.length !== 0">
        <BaseHeader html-type="h3">Versions précédentes :</BaseHeader>
        <table>
          <thead>
          <tr>
            <th>
              Statut
            </th>
            <th>
              Likes
            </th>
            <th>
              Dernier édit
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(article, index) in article.olderVersions" :key="index">
            <td v-html="article.stateIcon">
            </td>
            <td>
              {{article.likes}}
            </td>
            <td>
              {{article.dateOfLastUpdate}}
            </td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="deleteOrArchive">
        <BaseHeader html-type="h3">Archiver ou supprimer mon article</BaseHeader>
        <BaseParagraph>Votre article n'est plus à votre goût ? Pour ne plus qu'il soit visible par les autres membres, vous pouvez l'archiver. Vous pourrez ainsi conserver toutes ses statistiques, comme les likes et le nombre de vues. Vous pouvez également le supprimer. Il sera alors entièrement effacé</BaseParagraph>
        <BaseParagraph visual-type="danger">Attention ! Ces actions sont irréversibles !</BaseParagraph>
        <BaseButton v-if="!article.allVersionsAreArchived" visual-type="warning" icon="fas fa-lock" :loading="archiveArticleLoading" @buttonClicked="archiveArticle()">Archiver</BaseButton>
        <BaseButton visual-type="danger" icon="fas fa-trash-alt" :loading="deleteArticleLoading" @buttonClicked="deleteArticle()">Supprimer</BaseButton>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import articleEditQuery from '~/apollo/queries/Article/articleEdit.gql'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import ArticlePageEdit from '~/entities/Front/Article/Display/ArticlePageEdit'
import ArticleVersion, { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion.ts'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseArticleLoading from '~/components/Molecules/Article/BaseArticleLoading.vue'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    BaseHeader,
    BaseParagraph,
    BaseButton,
    BaseArticleLoading
  },
  setup() {
    const context = useContext()
    const params = context.params.value
    const article = ref<ArticlePageEdit>({} as ArticlePageEdit)
    const updateTitleLoading: boolean = false
    const newArticleVersionLoading: boolean = false
    const updateLastVersionLoading: boolean = false
    const updateDraftLoading: boolean = false
    const publishDraftLoading: boolean = false
    const archiveArticleLoading: boolean = false
    const deleteArticleLoading: boolean = false

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: articleEditQuery,
          prefetch: true,
          variables: {
            displayName: decodeURI("deozza"),
            title: decodeURI(params.title),
          },
        })
        .then((articleFromGQL: any) => {
          const articleGql: ArticleGql = new ArticleGql(articleFromGQL.data.article)
          article.value = new ArticlePageEdit(articleGql)
        })
        .catch((e: any) => console.log(e))
    })

    return {
      article,
      updateTitleLoading,
      newArticleVersionLoading,
      updateLastVersionLoading,
      updateDraftLoading,
      publishDraftLoading,
      archiveArticleLoading,
      deleteArticleLoading
    }
  },
  methods: {
    async updateTitle(){
      this.updateTitleLoading = true
      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)

      await articleRef
        .update({title: this.article.title})
        .then(() => {
          this.updateTitleLoading = false
        })
        .catch((e) => {
          this.updateTitleLoading = false
        })
    },
    async newArticleVersion(){
      this.newArticleVersionLoading = true

      const articleVersion: ArticleVersion = new ArticleVersion({})
      articleVersion.content = this.article.publishedVersion!.content
      articleVersion.articleUid = this.article.uid
      articleVersion.versionNumber = this.article.versions.length
      articleVersion.state = ArticleVersionState.PRE_PUBLISHED

      const articleVersionRef = this.$fire.firestore
        .collection('articleVersion')
        .doc(articleVersion.uid)

      await articleVersionRef
        .set(articleVersion.toJSON())
        .then(() => {
          this.newArticleVersionLoading = false
        })
        .catch((e) => {
          this.newArticleVersionLoading = false
        })
    },
    async updateLastVersion(){
      this.updateLastVersionLoading = true

      const articleRef = this.$fire.firestore
        .collection('articleVersion')
        .doc(this.article.lastVersion!.uid)

      await articleRef
        .update({content: this.article.lastVersion!.content, state: ArticleVersionState.PRE_PUBLISHED})
        .then(() => {
          this.updateLastVersionLoading = false
        })
        .catch((e) => {
          this.updateLastVersionLoading = false
        })
    },
    async updateDraft(){
      this.updateDraftLoading = true

      const articleRef = this.$fire.firestore
        .collection('articleVersion')
        .doc(this.article.draftVersion!.uid)

      await articleRef
        .update({content: this.article.draftVersion!.content})
        .then(() => {
          this.updateDraftLoading = false
        })
        .catch((e) => {
          this.updateDraftLoading = false
        })
    },
    async publishDraft(){
      this.publishDraftLoading = true

      const articleRef = this.$fire.firestore
        .collection('articleVersion')
        .doc(this.article.draftVersion!.uid)

      await articleRef
        .update({content: this.article.draftVersion!.content, state: ArticleVersionState.PRE_PUBLISHED})
        .then(() => {
          this.publishDraftLoading = false
        })
        .catch((e) => {
          this.publishDraftLoading = false
        })
    },
    async archiveArticle(){
      this.archiveArticleLoading = true

      let uids = []

      if(this.article.draftVersion !== null){
        uids.push(this.article.draftVersion.uid)
      }

      if(this.article.publishedVersion !== null){
        uids.push(this.article.publishedVersion.uid)
      }

      if(this.article.lastVersion !== null){
        uids.push(this.article.lastVersion.uid)
      }

      for(let version of this.article.olderVersions){
        uids.push(version.uid)
      }

      await uids.forEach((uid) => {
        const articleVersionRef = this.$fire.firestore
          .collection('articleVersion')
          .doc(uid)

        articleVersionRef
          .update({content: '', state: ArticleVersionState.ARCHIVED})
          .then(() => {
            this.archiveArticleLoading = false
          })
          .catch((e) => {
            console.log(e)
            this.archiveArticleLoading = false
          })
      })

    },
    async deleteArticle(){
      this.deleteArticleLoading = true

      let uids = []

      if(this.article.draftVersion !== null){
        uids.push(this.article.draftVersion.uid)
      }

      if(this.article.publishedVersion !== null){
        uids.push(this.article.publishedVersion.uid)
      }

      if(this.article.lastVersion !== null){
        uids.push(this.article.lastVersion.uid)
      }

      for(let version of this.article.olderVersions){
        uids.push(version.uid)
      }

      await uids.forEach((uid) => {
        const articleVersionRef = this.$fire.firestore
          .collection('articleVersion')
          .doc(uid)

        articleVersionRef
          .delete()
          .catch((e) => {
            console.log(e)
            this.archiveArticleLoading = false
          })
      })

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)

      await articleRef
        .delete()
        .then(() => {
          this.archiveArticleLoading = false
          this.$router.push('/profile')

        })
        .catch((e) => {
          console.log(e)
          this.archiveArticleLoading = false
        })
    }
  }
})
</script>

<style>
section section section {
  background-color: white;
  margin: 12px 0;
  padding: 12px
}
input#title {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  padding-left: 12px;
  width: auto;
}

input.input-text-title {
  font-size: 2em;
}

textarea {
  min-height: 40vh;
  width: 100%;
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none;
  padding-left: 12px;
}
</style>
