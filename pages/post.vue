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
    <BaseButton
      html-type="button"
      visual-type="primary"
      :loading="postLoading"
      @buttonClicked="post()"
      >Poster</BaseButton
    >
  </section>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'
import BaseAlertModele from '~/components/Atoms/Alert/BaseAlertModele'
import User from '~/entities/Api/User/User'
import ArticleVersion from '~/entities/Api/Article/ArticleVersion'
import Article from '~/entities/Api/Article/Article'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'

export default defineComponent({
  name: 'PostArticlePage',
  components: {
    BaseHeader,
    BaseButton,
  },
  setup() {
    const context = useContext()
    const articleAuthor: User = context.store.state.user.authUser
    const articleContent: string = ''
    const articleTags: string = ''
    const articleTitle: string = ''

    const alert: BaseAlertModele = new BaseAlertModele('', '')

    const authorLink: BaseLinkModele = new BaseLinkModele(
      ['users', articleAuthor.displayName],
      articleAuthor.displayName,
      true
    )

    const postLoading: boolean = false

    return {
      articleContent,
      articleTags,
      articleTitle,
      authorLink,
      alert,
      postLoading,
    }
  },
  methods: {
    async post() {
      this.postLoading = true
      const user = this.$store.state.user.authUser

      const article: Article = new Article({
        authorId: user.uid,
        title: this.articleTitle,
        tags: this.articleTags,
      })

      const articleVersion: ArticleVersion = new ArticleVersion({})

      article.versions = [articleVersion.uid]
      articleVersion.content = this.articleContent
      articleVersion.articleUid = article.uid

      const articleVersionRef = this.$fire.firestore
        .collection('articleVersion')
        .doc(articleVersion.uid)
      const articleRef = this.$fire.firestore
        .collection('articles')
        .doc(article.uid)

      await articleRef
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
        .catch(() => (this.postLoading = false))
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
</style>
