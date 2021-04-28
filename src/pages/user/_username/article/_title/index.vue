<template>
  <article>
    <div v-if="$fetchState.pending">
      <BaseArticleLoading></BaseArticleLoading>
    </div>
    <div
      v-else
      itemscope
      itemtype="http://schema.org/Article"
      class="article-viewer border"
    >
      <BaseHeader itemprop="name" html-type="h2">{{
        article.title
      }}</BaseHeader>
      <div class="article-header">
        <BaseParagraph visual-type="light" class="article-tags">
          <BaseLink v-for="(tag, index) in article.tags" :key="index" :link="tag">{{tag.title}}</BaseLink>
        </BaseParagraph>
        <BaseLink itemprop="author" :link="article.authorLink">{{
          article.authorDisplayName
        }}</BaseLink>
        <BaseParagraph itemprop="datePublished"
          >{{article.dateOfLastUpdateComputed}}</BaseParagraph
        >
      </div>
      <div
        itemprop="articleBody"
        class="article-content"
        v-html="$md.render(article.content)"
      />
      <div class="article-header">
        <div class="flex-row flex-left">
          <BaseParagraph
            class="p-footer"
            >{{ article.totalLikes }} <i
            class="fa-heart"
            :class="{
              'like-hover': isLoggedIn,
              'fas': article.isLikedByReader,
              'far': !article.isLikedByReader
            }"
            @click="likeArticle()"
          ></i
          ></BaseParagraph>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useFetch,
  ref,
} from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import ArticlePage from '~/entities/Front/Article/Display/ArticlePage'
import articleQuery from '~/apollo/queries/Article/article.gql'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import BaseArticleLoading from '~/components/Molecules/Article/BaseArticleLoading.vue'
import UserArticleLike from '~/entities/Api/Article/UserArticleLike'
import User from '~/entities/Api/User/User'

export default defineComponent({
  name: 'ArticleViewPage',
  components: {
    BaseHeader,
    BaseLink,
    BaseParagraph,
    BaseArticleLoading
  },
  setup() {
    const context = useContext()
    const params = context.params.value
    const article = ref<ArticlePage>({} as ArticlePage)
    const articleGql = ref<ArticleGql>({} as ArticleGql)
    const isLoggedIn = context.store.getters['user/isLoggedIn'];
    const user: User = context.store.getters['user/loggedUser'];

    useFetch(async () => {
      await context.app.apolloProvider.defaultClient
        .query({
          query: articleQuery,
          prefetch: true,
          variables: {
            displayName: decodeURI(params.username),
            title: decodeURI(params.title),
            readerUid: user.uid
          },
        })
        .then((articleFromGQL: any) => {
          const articleGqlAsObject: ArticleGql = new ArticleGql(articleFromGQL.data.article)

          article.value = new ArticlePage(articleGqlAsObject)
          articleGql.value = new ArticleGql(articleGqlAsObject)
        })
        .catch((e: any) => console.log(e))
    })

    return {
      article,
      articleGql,
      isLoggedIn
    }
  },
  methods: {
    async likeArticle(){
      if(!this.isLoggedIn){
        return
      }

      const user: User = this.$store.getters['user/loggedUser']
      const userArticleLikeRef = this.$fire.firestore
        .collection('userArticleLike')
        .doc(encodeURI(this.article.title+user.displayName))

      if(this.article.isLikedByReader !== true){
        await this.createALike(user, userArticleLikeRef)
      }else{
        await this.removeALike(userArticleLikeRef)
      }

    },
    async createALike(user: User, userArticleLikeRef: any){

      const userArticleLike: UserArticleLike = new UserArticleLike({
        userUid: user.uid,
        articleUid: this.articleGql.uid,
        articleVersionUid: this.articleGql.currentVersion.uid
      })

      await userArticleLikeRef
        .set(userArticleLike.toJSON())
        .then(() => {
          this.article.totalLikes += 1
          this.article.isLikedByReader = true
        })
        .catch((e: any) => {
        })
    },
    async removeALike(userArticleLikeRef: any){
      await userArticleLikeRef
        .delete()
        .then(() => {
          this.article.totalLikes -= 1
          this.article.isLikedByReader = false
        })
        .catch((e: any) => {
        })
    },
  },
})
</script>

<style>
div.article-viewer {
  background-color: white;
  padding: 12px 24px;
  margin-bottom: 24px;
  border-radius: 3px;
}

div.article-viewer.border {
  border: 1px solid var(--secondary_bg_hover);
}

div.article-viewer > div.article-header > a,
div.article-viewer > div.article-header > p.article-tags > a.tag-link {
  text-decoration: none;
  color: black;
}

div.article-viewer > div.article-header > p.article-tags {
  margin-bottom: 12px;
}

div.article-viewer > div.article-header > p.article-tags > a.tag-link{
  margin-right: 12px;
}

div.article-header div p.p-footer {
  padding-right: 12px;
}

div.article-content {
  padding-top: 24px;
}

div.article-content > h2 {
  padding-bottom: 12px;
  font-size: 1.75rem;
}

div.article-content > p {
  padding-bottom: 24px;
}

div.article-content > p > em {
  font-style: italic;
}

div.article-content > p > strong {
  font-weight: bold;
}

div.article-content > ul,
div.article-content > ol {
  padding-bottom: 24px;
}

div.article-content > ul > li {
  list-style: inside;
}

p.p-footer i.like-hover:hover{
  cursor: pointer;
}

div.article-content > iframe, div.article-content > p > img{
  max-width: 100%;
}

p.p-footer i.fas.fa-heart{
  color: red;
}
</style>
