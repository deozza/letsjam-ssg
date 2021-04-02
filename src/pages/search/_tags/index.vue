<template>
  <section>
    <BaseHeader html-type="h2">Rechercher des articles sur <span class="tag" v-for="(tag, index) in tags" :key="index">{{tag}}</span> </BaseHeader>
    <div v-if="$fetchState.pending">
      <BaseCardLoading></BaseCardLoading>
      <BaseCardLoading></BaseCardLoading>
      <BaseCardLoading></BaseCardLoading>
      <BaseCardLoading></BaseCardLoading>

    </div>
    <div v-else>
      <section class="search">
        <form @submit.prevent="search()">
          <div class="flex-row flex-between">
            <input
              id="tag"
              v-model="tagsInput"
              type="text"
              class="input-text-title"
              required
              placeholder="Rechercher un article (séparez les catégories par une virgule)"
              name="Rechercher un article"
              minlength="3"
              maxlength="200"
            />
            <BaseButton html-type="submit" visual-type="primary" :loading="searchLoading" icon="search" :only-icon="true"></BaseButton>
          </div>
        </form>
      </section>
      <div v-if="articles.length > 0">

        <BaseCard
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
      </div>
      <div class="flex-column" v-else>
        <BaseParagraph>Aucun article n'a encore été écrit dans cette catégorie...</BaseParagraph>
        <BaseLink :link="postLink">{{postLink.title}}</BaseLink>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useFetch,
  ref
} from '@nuxtjs/composition-api'
import BaseHeader from '~/components/Atoms/Typography/Header/BaseHeader.vue'
import ArticleCardInfo from '~/entities/Front/Article/Display/ArticleCardInfo'
import BaseCard from '~/components/Molecules/Card/BaseCard.vue'
import articlesQuery from '~/apollo/queries/Article/articles.gql'
import BaseCardLoading from '~/components/Molecules/Card/BaseCardLoading.vue'
import ArticleGql from '~/entities/Api/Article/ArticleGql'
import { ArticleVersionState } from '~/entities/Api/Article/ArticleVersion'
import BaseButton from '~/components/Atoms/Button/BaseButton.vue'
import BaseParagraph from '~/components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseLink from '~/components/Atoms/Link/BaseLink.vue'
import BaseLinkModele from '~/components/Atoms/Link/BaseLinkModele'

export default defineComponent({
  name: 'SearchPage',
  components: {
    BaseHeader,
    BaseCard,
    BaseCardLoading,
    BaseButton,
    BaseParagraph,
    BaseLink
  },
  setup() {
    const context = useContext()
    let queryTags: Array<string> = context.params.value.tags.split('&')

    const articles  = ref<ArticleCardInfo[]>([])
    const tags: Array<string> = []
    let tagsInput: string = ''
    const searchLoading: boolean = false

    if(!Array.isArray(queryTags)){
      queryTags = [queryTags]
    }

    queryTags.forEach((tag) => {
      tags.push(decodeURI(tag.replace(' ', '-')))
      tagsInput += decodeURI(tag)+ ","
    })

    const postLink: BaseLinkModele = new BaseLinkModele(
      ['post'],
      'En créer un ?',
      true,
      '',
      ['btn', 'btn-primary', 'btn-outline'],
    )

    useFetch(async () => {

      console.log(tags)

      await context.app.apolloProvider.defaultClient
        .query({
          query: articlesQuery,
          variables: {
            tags: tags
          }
        })
        .then((articlesFromGQL: any) => {
          const publicArticles: Array<ArticleGql> = articlesFromGQL.data.articles
          publicArticles.forEach((publicArticle: ArticleGql) => {
            if(publicArticle.currentVersion.state === ArticleVersionState.PUBLISHED){
              const articleCardInfo: ArticleCardInfo = new ArticleCardInfo(publicArticle)
              articles.value.push(articleCardInfo)
            }
          })

          console.log(articles)
        })
        .catch((e: any) => console.log(e))
    })

    return {
      articles,
      tagsInput,
      tags,
      postLink,
      searchLoading
    }
  },
  methods: {
    async search() {

      let searchQuery = ''

      this.tagsInput.split(',').forEach((tag, index) => {
        if(tag !== ''){
          searchQuery += encodeURI(tag.toLowerCase().replace(' ', '-'))
          searchQuery += '&'

          if(!this.tags.includes(tag)){
            this.tags.push(tag)
          }

        }
      })

      await this.$router.push('/search/'+searchQuery.slice(0,-1))

    },
  }
})
</script>

<style scoped>

section.search {
  background-color: white;
  margin: 12px 0 48px 0;
  padding: 0 12px
}

input#tag {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  padding-left: 12px;
  width: 90%;
}

input#tag.input-text-title {
  font-size: 1em;
}

span.tag{
  background-color: var(--primary_bg);
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: normal;
}
</style>
