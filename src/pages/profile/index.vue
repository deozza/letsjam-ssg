<template>
  <section>
    <BaseHeader html-type="h2">Mon profil</BaseHeader>
    <div class="flex-row flex-between">
      <section class="profile-info">
        <BaseHeader html-type="h3">{{profile.displayName}}</BaseHeader>
        <BaseParagraph visual-type="light">Email : {{profile.email}}</BaseParagraph>
        <BaseParagraph visual-type="light">
          Centres d'intérêts :
          <BaseTag v-for="(tag, index) in profile.tags" :key="tag.title" :tag="tag" />
        </BaseParagraph>
        <BaseButton visual-type="primary" @buttonClicked="redirectToEditProfile()">Editer</BaseButton>
      </section>
      <section class="articles-posted">
        <BaseHeader html-type="h3">Mes articles</BaseHeader>
        <table>
          <thead>
            <tr>
              <th>
                Titre
              </th>
              <th>
                Statut
              </th>
              <th>
                Likes
              </th>
              <th>
                Dernier édit
              </th>
              <th>
                Editer
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(article, index) in articles" :key="index">
              <td>
                {{article.title}}
              </td>
              <td v-html="article.state">
              </td>
              <td>
                {{article.totalLikes}}
              </td>
              <td>
                {{article.dateOfLastUpdate}}
              </td>
              <td>
                <BaseLink :link="article.articleLink"></BaseLink>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="articles-liked">
        <BaseHeader html-type="h3">Articles que j'ai liké</BaseHeader>
        <div v-if="this.likedArticlesInfo.length === 0">
          <BaseParagraph visual-type="light">Aucun article ne vous a plus...</BaseParagraph>
        </div>
        <div v-else class="flex-column flex-left liked-articles-container">
          <div class="flex-column flex-left"  v-for="(article, index) in likedArticlesInfo" :key="index" @click="goToArticle(article)">
            <div class="flex-row flex-between">
              <BaseParagraph visual-type="light" class="liked-article-title">{{article.title}}</BaseParagraph>
              <BaseParagraph visual-type="light" >par {{article.authorDisplayName}}</BaseParagraph>
            </div>
            <BaseParagraph visual-type="light">{{article.contentExtract}}</BaseParagraph>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import profileQuery from '~/apollo/queries/User/profile.gql'
import ProfileGql from '~/entities/Api/User/ProfileGql'
import Profile from '~/entities/Front/User/Display/Profile'
import ArticleCardInfoProfilePage from '~/entities/Front/Article/Display/ArticleCardInfoProfilePage'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import User from '~/entities/Api/User/User'
import LikedArticleProfilePage from '~/entities/Front/Article/Display/LikedArticleProfilePage'
import BaseTag from '~/components/Atoms/Tag/BaseTag.vue'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    BaseHeader,
    BaseParagraph,
    BaseButton,
    BaseLink,
    BaseTag
  },
  middleware: 'authenticated',
  setup() {
    const context = useContext()
    const profile = ref<Profile>({} as Profile)
    const articles = ref<ArticleCardInfoProfilePage[]>([])
    const likedArticlesInfo = ref<LikedArticleProfilePage[]>([])
    const user: User = context.store.getters['user/loggedUser']
    const userDisplayName: string = user.displayName

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: profileQuery,
          prefetch: true,
          variables: {
            displayName: decodeURI(userDisplayName),
          },
        })
        .then((profileFromGQL: any) => {
          const profileGql: ProfileGql = new ProfileGql(profileFromGQL.data.profile)
          profile.value = new Profile(profileGql)

          const publicArticles: Array<ArticleGql> = []
          profileFromGQL.data.profile.articles.forEach((article: object) => publicArticles.push(new ArticleGql(article)))

          publicArticles.forEach((publicArticle: ArticleGql) => {
            const articleCardInfo: ArticleCardInfoProfilePage = new ArticleCardInfoProfilePage(publicArticle)
            articles.value.push(articleCardInfo)
          })

          const likedArticles: Array<ArticleGql> = []
          profileFromGQL.data.profile.likedArticles.forEach((article: any) => {
            likedArticles.push(new ArticleGql(article.article))
          })

          likedArticles.forEach((likedArticle: ArticleGql) => {
            const likedArticleInfo: LikedArticleProfilePage = new LikedArticleProfilePage(likedArticle)
            likedArticlesInfo.value.push(likedArticleInfo)
          })

        })
        .catch((e: any) => console.log(e))
    })

    return { articles, profile, likedArticlesInfo }
  },
  methods: {
    async redirectToEditProfile() {
      await this.$router.push('/profile/edit')
    },
    async goToArticle(article: LikedArticleProfilePage){
      await this.$router.push('/user/'+encodeURI(article.authorDisplayName)+'/article/'+encodeURI(article.title))
    }

  },
})
</script>

<style>
div.flex-row section {
  min-height: 50vh;
  background-color: white;
  padding: 12px;
  margin-bottom: 12px;
}

div.flex-row section.profile-info {
  width: 20%;
}

div.flex-row section.profile-info p {
  margin: 12px 0
}


div.flex-row section.profile-info button {
  margin-top: 24px;
  margin-left: 0;
}

div.flex-row section.articles-posted {
  width: 75%;
}

table {
  border-collapse: collapse;
  padding: 0;
  width: 90%;
  table-layout: fixed;
  margin: 25px 0;
  font-size: 0.9em;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

table caption {
  font-size: 1.5em;
  margin: 0.5em 0 0.75em;
}

table tbody tr {
  border-bottom: 1px solid #ddd;
}

table thead tr {
  background-color: #009879;
  color: #fff;
  text-align: left;
}

table th,
table td {
  padding: 12px 15px;
  text-align: center;
}

tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

table tbody tr td span {
  padding-left: 12px;
  padding-right: 12px;
}

table tbody tr td span a {
  text-decoration: none;
  color: black;
}

table tbody tr td span a:hover {
  cursor: pointer;
  color: var(--primary_text_hover);
}

table tbody tr td span i {
  padding-left: 6px;
  padding-right: 6px;
}


div.flex-row section.articles-liked {
  margin: 12px 0 0 0;
  width: 75%;
}

div.liked-articles-container {
  width: 90%;
}

div.liked-articles-container div.flex-column{
  width: 100%;
  border:2px var(--secondary_bg) solid;
  padding: 12px;
  margin-bottom: 24px;
  border-radius: 3px;
}

div.liked-articles-container div.flex-column:hover{
  cursor: pointer;
}

div.liked-articles-container div.flex-column div.flex-row{
  width: 100%;
  padding-bottom: 12px;
}

div.liked-articles-container div.flex-column div.flex-row p.liked-article-title{
  font-size: 1.75rem;
  font-weight: bold;
}

div.liked-articles-container div.flex-column p{
  overflow-wrap: anywhere;
}

@media screen and (min-width: 1024px) {
  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }
  div.flex-row section.articles-liked {
    margin-left:25%;
  }
}

@media screen and (max-width: 1024px) {
  div.flex-row section{
    width: 100% !important;
  }
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td::before[data-label='Actions'] {
    color: red;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>


