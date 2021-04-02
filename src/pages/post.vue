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


    <div class="flex-row flex-left selected-tags" style="width: 100%">
      <BaseParagraph visual-type="light">Catégories de votre article : </BaseParagraph>
      <BaseButton
        v-for="(tag, index) of articleTags" :key="index"
        visual-type="primary"
        :outline="true"
        icon="times"
        @buttonClicked="removeTag(tag)"
      >
        {{tag}}
      </BaseButton>
    </div>

    <div class="flex-row flex-between">
      <div  style="width: 33%">
        <input
          id="tag"
          v-model="newTag"
          type="text"
          class=""
          required
          placeholder="Ajouter une catégorie"
          name="Ajouter une catégorie"
          minlength="1"
          maxlength="200"
        />
        <BaseButton
          html-type="button"
          visual-type="primary"
          icon="plus"
          @buttonClicked="addTag(newTag, true)"
        >Ajouter</BaseButton
        >
      </div>
      <div >
        <BaseParagraph visual-type="light">Propositions de catégories :</BaseParagraph>
        <div class="flex-row flex-left">
          <BaseButton
            v-for="(tag, index) of tagsPresetLeft" :key="index"
            visual-type="primary"
            :outline="true"
            icon="plus"
            @buttonClicked="addTag(tag)"
          >
            {{tag}}
          </BaseButton>
        </div>
      </div>
    </div>


    <div class="button-container">
      <BaseButton
        html-type="button"
        visual-type="success"
        :loading="postLoading"
        icon="check"
        @buttonClicked="post(false)"
      >Poster</BaseButton
      >
      <BaseButton
        html-type="button"
        visual-type="primary"
        :loading="postLoading"
        icon="save"
        @buttonClicked="post(true)"
      >Sauvegarder le brouillon</BaseButton
      >
    </div>
    <BaseParagraph visual-type="danger" v-if="error !== ''">{{error}}</BaseParagraph>
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

export default defineComponent({
  name: 'PostArticlePage',
  components: {
    BaseHeader,
    BaseButton,
    BaseParagraph,
  },
  setup({ maxWidth }) {
    const context = useContext()
    const articleAuthor: User = context.store.state.user.authUser
    const articleTags: Array<string> = []
    const tagsPreset = ref<Array<string>>([])
    const tagsPresetLeft = ref<Array<string>>([])
    const articleContent: string = ''
    const newTag: string = ''
    const articleTitle: string = ''
    const error: string = ''

    const alert: BaseAlertModele = new BaseAlertModele('', '')

    const authorLink: BaseLinkModele = new BaseLinkModele(
      ['users', articleAuthor.displayName],
      articleAuthor.displayName,
      true
    )

    const postLoading: boolean = false

    const cssVars = ref({ '--max-width': maxWidth })

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: tagsQuery,
          prefetch: true
        })
        .then((tagsFromGQL: any) => {
          tagsFromGQL.data.tags.forEach((tagFromGql: any) => {
            tagsPreset.value.push(tagFromGql.name)
            tagsPresetLeft.value.push(tagFromGql.name)
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
      postLoading,
      error,
      cssVars,
      tagsPreset,
      tagsPresetLeft
    }
  },
  methods: {
    addTag(tagName: string, manual: boolean = false){
      if(tagName.length < 3){
        return
      }
      this.articleTags.push(tagName.toLowerCase().replace(' ', '-'))

      if(manual === false || this.tagsPresetLeft.includes(tagName.toLowerCase().replace(' ', '-')) === true){
        this.tagsPresetLeft.splice(this.tagsPresetLeft.indexOf(tagName.toLowerCase().replace(' ', '-')), 1)
      }else{
        this.newTag = ''
      }

    },
    removeTag(tagName: string){
      this.articleTags.splice(this.articleTags.indexOf(tagName.toLowerCase().replace(' ', '-')), 1)

      if(this.tagsPreset.includes(tagName) === true && this.tagsPresetLeft.includes(tagName.toLowerCase().replace(' ', '-')) === false){
        this.tagsPresetLeft.push(tagName)
      }
    },
    async post(isDraft: boolean) {
      this.postLoading = true
      this.error = ''
      const user = this.$store.state.user.authUser

      const article: ArticlePost = new ArticlePost({
        authorUid: user.uid,
        title: this.articleTitle,
        tags: this.articleTags,
      })

      const articleVersion: ArticleVersion = new ArticleVersion({})

      article.versions = [articleVersion.uid]
      article.currentVersion = articleVersion.uid
      articleVersion.content = this.articleContent
      articleVersion.articleUid = article.uid

      if(!isDraft){
        articleVersion.state = ArticleVersionState.PRE_PUBLISHED
      }

      const articleVersionRef = this.$fire.firestore
        .collection('articleVersion')
        .doc(articleVersion.uid)
      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(article.uid)
      const uniqueArticleRef = this.$fire.firestore
        .collection('uniqueArticlePerUser')
        .doc(encodeURI(article.title)+encodeURI(user.displayName))

      await uniqueArticleRef
        .set({articleUid: article.title, authorUid: article.authorUid})
        .then(() => {
          articleRef
            .set(article.toJSON())
            .then(() => {
              articleVersionRef.set(articleVersion.toJSON())
            })
            .then(() => {
              this.postLoading = false
              this.$router.push({
                path: '/profile',
                query: { success: 'true' },
              })
            })
            .catch(() => {
              this.postLoading = false
              this.error = 'Une erreur est survenue, veuillez réessayer plus tard.'

            })
        })
        .catch(() => {
          this.postLoading = false
          this.error = 'Vous avez déjà posté un article avec le même nom.'
        })
    },
  },
})
</script>

<style>
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

</style>
