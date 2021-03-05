<template>
  <section>
    <BaseHeader html-type="h2">Mon profil</BaseHeader>
    <div class="flex-row flex-between">
      <section class="profile-info">
        <BaseHeader html-type="h3">{{profile.displayName}}</BaseHeader>
        <BaseParagraph visual-type="light">Email : {{profile.email}}</BaseParagraph>
        <BaseButton visual-type="primary" @buttonClicked="redirectToEditProfile()">Editer</BaseButton>
      </section>
      <section class="articles-posted">
        <BaseHeader html-type="h3">Mes articles</BaseHeader>
        <pre>{{articles}}</pre>
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
import ArticlesGql from '~/entities/Api/Article/ArticlesGql'
import ArticleCardInfoProfilePage from '~/entities/Front/Article/Display/ArticleCardInfoProfilePage'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    BaseHeader,
    BaseParagraph,
    BaseButton,
  },
  setup() {
    const context = useContext()
    const profile = ref({})
    const articles: Array<ArticleCardInfoProfilePage> = []

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: profileQuery,
          prefetch: true,
          variables: {
            displayName: decodeURI("deozza"),
          },
        })
        .then((profileFromGQL: any) => {
          const profileGql: ProfileGql = new ProfileGql(profileFromGQL.data.profile)
          profile.value = new Profile(profileGql)

          const publicArticles: Array<ArticlesGql> = profileFromGQL.data.profile.articles


          publicArticles.forEach((publicArticle: ArticlesGql) => {
            console.log(publicArticle)

            const articleCardInfo: ArticleCardInfoProfilePage = new ArticleCardInfoProfilePage(publicArticle)
            articles.push(articleCardInfo)
          })
        })
        .catch((e: any) => console.log(e))
    })

    return { articles, profile }
  },
  methods: {
    async redirectToEditProfile() {
      await this.$router.push('/profile/edit')
    },
  },
})
</script>

<style>
div.flex-row section {
  min-height: 50vh;
  background-color: white;
  padding: 12px;
}

div.flex-row section.profile-info {
  width: 20%;
}

div.flex-row section.profile-info button {
  margin-top: 24px;
  margin-left: 0;
}


div.flex-row section.articles-posted {
  width: 75%;
}
</style>


