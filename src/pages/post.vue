<template>
  <section>
    <BaseHeader html-type="h2">Ecrire un nouvel article</BaseHeader>
    <div class="tabset">
      <!-- Tab 1 -->
      <input
        id="tab1"
        type="radio"
        name="tabset"
        aria-controls="edit"
        checked
      />
      <label for="tab1">Editer</label>
      <!-- Tab 2 -->
      <input id="tab2" type="radio" name="tabset" aria-controls="preview" />
      <label for="tab2">Prévisualiser</label>

      <div class="tab-panels">
        <section id="edit" class="tab-panel flex-column">
          <input
            id="title"
            v-model="articleTitle"
            type="text"
            class="input-text-title"
            required
            placeholder="Titre de votre article"
            name="Titre de votre article"
            minlength="10"
            maxlength="200"
          />
          <textarea
            v-model="articleContent"
            name="editor"
            placeholder="Ecrire ici votre article"
          ></textarea>
        </section>
        <section id="preview" class="tab-panel">
          <BaseHeader itemprop="name" html-type="h2">{{
              articleTitle
            }}</BaseHeader>
          <div class="content" v-html="$md.render(articleContent)" />
        </section>
      </div>
    </div>


    <section class="tags">

      <div class="flex-column flex-left">

        <div class="flex-row flex-left selected-tags" style="width: 100%">
          <BaseParagraph visual-type="light">Catégories de votre article : </BaseParagraph>
          <BaseTag v-for="(tag, index) in articleTags" :key="tag.title" :tag="tag" v-on:tagClick="removeTag($event)" />
        </div>

        <div class="flex-row flex-between manual-input-container">
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
            icon="fas fa-plus"
            v-on:buttonClicked="addManualTag(newTag)"
          >Ajouter</BaseButton
          >
        </div>
        <div >
          <BaseParagraph visual-type="light">Propositions de catégories :</BaseParagraph>
          <div class="flex-row flex-left">
            <BaseTag v-for="(tag, index) in tagsPresetLeft" :key="index" :tag="tag" v-on:tagClick="addTag($event)"/>
          </div>
        </div>
      </div>
    </section>

    <div class="button-container">
      <BaseButton
        html-type="button"
        visual-type="success"
        :loading="state.postLoading"
        icon="fas fa-check"
        @buttonClicked="post(false)"
      >Poster</BaseButton
      >
      <BaseButton
        html-type="button"
        visual-type="primary"
        :loading="state.postLoading"
        icon="fas fa-save"
        @buttonClicked="post(true)"
      >Sauvegarder le brouillon</BaseButton
      >
    </div>
    <BaseParagraph visual-type="danger" v-if="state.error !== ''">{{state.error}}</BaseParagraph>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import BaseAlertModele from '~/components/Atoms/Alert/BaseAlertModele'
import User from '~/entities/Api/User/User'
import ArticleVersion, { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'
import ArticlePost from '~/entities/Api/Article/ArticlePost'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import tagsQuery from '~/apollo/queries/Tags/tags.gql'
import BaseTagModele from '~/components/Atoms/Tag/BaseTagModele'
import BaseTag from '~/components/Atoms/Tag/BaseTag.vue'

export default defineComponent({
  name: 'PostArticlePage',
  components: {
    BaseHeader,
    BaseButton,
    BaseParagraph,
    BaseTag
  },
  middleware: 'authenticated',
  data() {
    return {
      articleTags: []
    }
  },
  setup({ maxWidth }) {
    const context = useContext()
    const articleAuthor: User = context.store.state.user.authUser
    const articleTags: Array<BaseTagModele> = []
    const tagsPreset = ref<Array<string>>([])
    const tagsPresetLeft = ref<Array<BaseTagModele>>([])
    const articleContent: string = ''
    const newTag: string = ''
    const articleTitle: string = ''

    const state = {
      error: '',
      postLoading: false,
      maxTagsLengthReached: false
    }

    const alert: BaseAlertModele = new BaseAlertModele('', '')

    const authorLink: BaseLinkModele = new BaseLinkModele(
      ['users', articleAuthor.displayName],
      articleAuthor.displayName,
      true
    )

    const cssVars = ref({ '--max-width': maxWidth })

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
    })

    return {
      newTag,
      articleContent,
      articleTitle,
      articleTags,
      authorLink,
      alert,
      cssVars,
      tagsPreset,
      tagsPresetLeft,
      state
    }
  },
  methods: {
    addManualTag(tagName: string){
      if(tagName.length < 3){
        return
      }
      const tag: BaseTagModele = new BaseTagModele(tagName, false, true)

      this.addTag(tag)

    },
    addTag(tag: BaseTagModele){
      if(this.articleTags.length >= 5 || this.state.maxTagsLengthReached){
        this.state.maxTagsLengthReached = true
        return
      }

      tag.canAdd = false
      tag.canRemove = true

      this.articleTags.push(tag)

      if(this.tagsPresetLeft.map(tagPresetLeft => tagPresetLeft.title).includes(tag.title) === true){
        this.tagsPresetLeft.splice(this.tagsPresetLeft.indexOf(tag), 1)
      }
      this.state.maxTagsLengthReached = this.articleTags.length >= 5
    },
    removeTag(tag: BaseTagModele){
      this.articleTags.splice(this.articleTags.indexOf(tag), 1)
      tag.canRemove = false
      tag.canAdd = true

      if(this.tagsPreset.includes(tag) === true && this.tagsPresetLeft.includes(tag) === false){
        this.tagsPresetLeft.push(tag)
      }

      this.state.maxTagsLengthReached = false
    },
    async post(isDraft: boolean) {
      this.state.postLoading = true
      this.state.error = ''

      if(!isDraft && (this.articleTags.length < 1 || this.articleTags.length > 5)){
        this.state.error = 'Vous devez préciser entre 1 et 5 catégories pour votre article.'
        this.state.postLoading = false
        return
      }

      const user = this.$store.state.user.authUser

      const article: ArticlePost = new ArticlePost({
        authorUid: user.uid,
        title: this.articleTitle,
        tags: this.articleTags,
      })

      const articleVersion: ArticleVersion = new ArticleVersion({})

      article.currentVersion = articleVersion.uid
      articleVersion.content = this.articleContent
      articleVersion.articleUid = article.uid

      if(!isDraft){
        articleVersion.state = ArticleVersionState.PRE_PUBLISHED
      }

      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(article.uid)
      const uniqueArticleRef = this.$fire.firestore
        .collection('uniqueArticlePerUser')
        .doc(encodeURI(article.title)+encodeURI(user.displayName))

      await uniqueArticleRef.set({articleUid: article.uid, authorUid: article.authorUid})
        .then(() => {
          articleRef.set(article.toJSON())
            .then(() => {
              articleRef.collection('versions').doc(articleVersion.uid).set(articleVersion.toJSON())
                .then(() => {
                  this.$router.push({
                    path: '/profile',
                    query: { success: 'true' },
                  })
                }).catch(() => {
                this.state.postLoading = false
                this.state.error = 'Une erreur est survenue, veuillez réessayer plus tard.'
              })
            }).catch(() => {
            this.state.postLoading = false
            this.state.error = 'Une erreur est survenue, veuillez réessayer plus tard.'
          })
        }).catch(() => {
          this.state.postLoading = false
          this.state.error = 'Vous avez déjà posté un article avec le même nom.'
        })
    },
  },
})
</script>

<style scoped>
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

input {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  padding-left: 12px;
  width: 100%;
}

input.input-text-title {
  font-size: 2em;
}

.tab-panel {
  background-color: white;
  padding: 30px 0;
  border-top: 1px solid #ccc;
}

/*
 CSS for the main interaction
*/
.tabset > input[type='radio'] {
  position: absolute;
  left: -200vw;
}

.tabset .tab-panel {
  display: none;
}

.tabset > input:first-child:checked ~ .tab-panels > .tab-panel:first-child,
.tabset > input:nth-child(3):checked ~ .tab-panels > .tab-panel:nth-child(2),
.tabset > input:nth-child(5):checked ~ .tab-panels > .tab-panel:nth-child(3),
.tabset > input:nth-child(7):checked ~ .tab-panels > .tab-panel:nth-child(4),
.tabset > input:nth-child(9):checked ~ .tab-panels > .tab-panel:nth-child(5),
.tabset > input:nth-child(11):checked ~ .tab-panels > .tab-panel:nth-child(6) {
  display: block;
}

/*
 Styling
*/

.tabset > label {
  position: relative;
  display: inline-block;
  padding: 15px 15px 25px;
  border-bottom: 0;
  cursor: pointer;
  font-weight: 600;
}

.tabset > label::after {
  content: '';
  position: absolute;
  left: 15px;
  bottom: 10px;
  width: 22px;
  height: 4px;
  background: #8d8d8d;
}

.tabset > label:hover,
.tabset > input:focus + label,
.tabset > input:checked {
  color: var(--primary_text);
}

.tabset > label:hover::after,
.tabset > input:focus + label::after,
.tabset > input:checked + label::after {
  background: var(--primary_bg);
}

/*
 Demo purposes only
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}

.tabset {
  max-width: 65em;
  margin-bottom: 24px;
}

p.selected-tags{
  margin-bottom: 24px;
}

p.selected-tags > p{
  margin-right: 12px;
}

section#preview div.content {
  padding-top: 24px;
}

section#preview div.content > h2 {
  padding-bottom: 12px;
  font-size: 1.75rem;
}

section#preview div.content > p {
  padding-bottom: 24px;
}

section#preview div.content img {
  max-width: var(--max-width);
  width: 100%;
  height: auto;
}

section#preview div.content > p > em {
  font-style: italic;
}

section#preview div.content > p > strong {
  font-weight: bold;
}

section#preview div.content > ul,
section#preview div.content > ol {
  padding-bottom: 24px;
}

section#preview div.content > ul > li {
  list-style: inside;
}

p.tag-pill:hover > i{
  color: white
}

div.selected-tags{
  margin: 12px 0
}

div.button-container{
  margin: 24px 0;
}

section.tags > div.flex-column > div{
  margin: 12px 0;
}

div.flex-row.flex-left.selected-tags{
  align-items: center;
}

div.manual-input-container{
  width: 50%;
}


input#tag.add-tag-manually {
  padding: 12px;
  width: 70%
}

@media only screen and (max-width: 1024px) {
  div.manual-input-container{
    width: 100%;
  }

  input#tag.add-tag-manually {
    width: 100%
  }

}


</style>
