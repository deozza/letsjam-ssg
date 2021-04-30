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
          <BaseButton v-if="!article.allVersionsAreArchived" html-type="submit" visual-type="success" @buttonClicked="updateTitle()" :loading="state.updateTitleLoading">Editer le titre</BaseButton>
        </div>
      </section>

      <div class="flex-row flex-left selected-tags" style="width: 100%">
        <BaseParagraph visual-type="light">Catégories de votre article : </BaseParagraph>
        <BaseTag v-for="(tag, index) in article.tags" :key="tag.title" :tag="tag" v-on:tagClick="removeTag($event)" />
      </div>

      <div class="flex-row flex-between">
        <div class="flex-row flex-between" style="width: 50%">
          <input
            id="tag"
            v-model="newTag"
            type="text"
            class="add-tag-manually"
            required
            placeholder="Nouvelle catégorie"
            name="Nouvelle catégorie"
            minlength="1"
            maxlength="200"
          />
          <BaseButton
            html-type="button"
            visual-type="primary"
            :disabled="state.maxTagsLengthReached"
            icon="plus"
            @buttonClicked="addTag(newTag, true)"
          >Ajouter</BaseButton
          >
        </div>
      </div>

      <section class="publishedVersion" v-if="article.publishedVersion !== null">
        <BaseHeader html-type="h3">Version en ligne :</BaseHeader>
        <textarea
          v-model="article.publishedVersion.content"
          name="editor"
          placeholder="Ecrire ici votre article"
        ></textarea>
        <BaseButton v-if="article.lastVersion === null" visual-type="success" @buttonClicked="newArticleVersion()" :loading="state.newArticleVersionLoading">Modifier l'article</BaseButton>
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
          <BaseButton visual-type="success" @buttonClicked="updateLastVersion()" :loading="state.updateLastVersionLoading">Corriger l'article</BaseButton>
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
          <BaseButton visual-type="warning" @buttonClicked="updateDraft()" :loading="state.updateDraftLoading">Modifier le brouillon</BaseButton>
          <BaseButton visual-type="success" @buttonClicked="publishDraft()" :loading="state.publishDraftLoading">Mettre en ligne l'article</BaseButton>
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
        <BaseButton v-if="!article.allVersionsAreArchived" visual-type="warning" icon="fas fa-lock" :loading="state.archiveArticleLoading" @buttonClicked="archiveArticle()">Archiver</BaseButton>
        <BaseButton visual-type="danger" icon="fas fa-trash-alt" :loading="state.deleteArticleLoading" @buttonClicked="deleteArticle()">Supprimer</BaseButton>
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
import ArticleVersion, { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseArticleLoading from '~/components/Molecules/Article/BaseArticleLoading.vue'
import VersionGql from '~/entities/Api/Article/VersionGql'
import ArticleVersionPageEdit from '~/entities/Front/Article/Display/ArticleVersionPageEdit'
import BaseTag from '~/components/Atoms/Tag/BaseTag.vue'
import BaseTagModele from '~/components/Atoms/Tag/BaseTagModele'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    BaseHeader,
    BaseParagraph,
    BaseButton,
    BaseArticleLoading,
    BaseTag
  },
  middleware: 'authenticated',
  setup() {
    const context = useContext()
    const params = context.params.value
    const article = ref<ArticlePageEdit>({} as ArticlePageEdit)
    const newTag: string = ''

    const state = {
      updateTitleLoading: false,
      updateTagsLoading: false,
      newArticleVersionLoading: false,
      updateLastVersionLoading: false,
      updateDraftLoading: false,
      publishDraftLoading: false,
      archiveArticleLoading: false,
      deleteArticleLoading: false,
      maxTagsLengthReached: false
    }

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
      newTag,
      state
    }
  },
  methods: {
    async updateTitle(){
      this.state.updateTitleLoading = true
      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)

      await articleRef
        .update({title: this.article.title})
        .then(() => {
          this.state.updateTitleLoading = false
        })
        .catch((e) => {
          this.state.updateTitleLoading = false
        })
    },
    async addTag(tagName: string){
      if(tagName.length < 3){
        return
      }

      if(this.article.tags.length >= 5 || this.state.maxTagsLengthReached){
        this.state.maxTagsLengthReached = true
        return
      }
      const tag: BaseTagModele = new BaseTagModele(tagName, false, true)

      this.article.tags.push(tag)

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)

      await articleRef
        .update({tags: this.article.tags.map(tag => tag.title)})
        .then(() => {
          this.state.updateTagsLoading = false
          this.newTag = ''
          this.state.maxTagsLengthReached = this.article.tags.length >= 5
        })
        .catch((e) => {
          this.state.updateTagsLoading = false
        })
    },
    async removeTag(tag: BaseTagModele){
      this.state.updateTagsLoading = true
      this.article.tags.splice(this.article.tags.indexOf(tag), 1)

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)

      await articleRef
        .update({tags: this.article.tags.map(tag => tag.title)})
        .then(() => {
          this.state.updateTagsLoading = false
          this.newTag = ''

        })
        .catch((e) => {
          this.state.updateTagsLoading = false
        })
    },
    async newArticleVersion(){
      this.state.newArticleVersionLoading = true

      const articleVersion: ArticleVersion = new ArticleVersion({})
      articleVersion.content = this.article.publishedVersion!.content
      articleVersion.articleUid = this.article.uid
      articleVersion.versionNumber = this.article.versions.length
      articleVersion.state = ArticleVersionState.PRE_PUBLISHED

      const articleVersionRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)
        .collection("versions")
        .doc(articleVersion.uid)

      await articleVersionRef
        .set(articleVersion.toJSON())
        .then(() => {

          this.article.lastVersion = new ArticleVersionPageEdit(new VersionGql(articleVersion))
          this.state.newArticleVersionLoading = false
        })
        .catch((e) => {
          this.state.newArticleVersionLoading = false
        })
    },
    async updateLastVersion(){
      this.state.updateLastVersionLoading = true

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)
        .collection("versions")
        .doc(this.article.lastVersion!.uid)

      await articleRef
        .update({content: this.article.lastVersion!.content, state: ArticleVersionState.PRE_PUBLISHED})
        .then(() => {
          this.state.updateLastVersionLoading = false

        })
        .catch((e) => {
          console.log(e)
          this.state.updateLastVersionLoading = false
        })
    },
    async updateDraft(){
      this.state.updateDraftLoading = true

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)
        .collection("versions")
        .doc(this.article.draftVersion!.uid)

      await articleRef
        .update({content: this.article.draftVersion!.content})
        .then(() => {
          this.state.updateDraftLoading = false
        })
        .catch((e) => {
          this.state.updateDraftLoading = false
        })
    },
    async publishDraft(){
      this.state.publishDraftLoading = true

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)
        .collection("versions")
        .doc(this.article.draftVersion!.uid)

      await articleRef
        .update({content: this.article.draftVersion!.content, state: ArticleVersionState.PRE_PUBLISHED})
        .then(() => {
          this.state.publishDraftLoading = false
        })
        .catch((e) => {
          this.state.publishDraftLoading = false
        })
    },
    async archiveArticle(){
      this.state.archiveArticleLoading = true

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
            this.state.archiveArticleLoading = false
          })
          .catch((e) => {
            console.log(e)
            this.state.archiveArticleLoading = false
          })
      })

    },
    async deleteArticle(){
      this.state.deleteArticleLoading = true

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
            this.state.deleteArticleLoading = false
          })
      })

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(this.article.uid)

      await articleRef
        .delete()
        .then(() => {
          this.state.deleteArticleLoading = false
          this.$router.push('/profile')

        })
        .catch((e) => {
          console.log(e)
          this.state.deleteArticleLoading = false
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

input#tag.add-tag-manually {
  padding: 12px;
  width: 65%
}
</style>
