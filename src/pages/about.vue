<template>
  <div>
    <section class="about-header full-height">
      <BaseHeader html-type="h1">Parler musique... autrement</BaseHeader>
      <div class="description">
        <BaseParagraph>Letsjam est la première plateforme en France permettant à n'importe qui de discuter autours de la musique. Le tout accessible gratuitement avec un simple compte.</BaseParagraph>
      </div>
      <div class="flex-column flex-around">
        <BaseHeader html-type="h2">Vous voulez jammer avec nous ?</BaseHeader>
        <BaseLink :link="createAccountLink">{{createAccountLink.title}}</BaseLink>
      </div>
    </section>

    <section class="bg-white flex-column">
      <div class="flex-column">
        <BaseParagraph class="p-center">Tout le monde peut écrire un article sur Letsjam. Que vous soyez un musicien amateur ou professionel, un organisateur de concert, un professionel de studio d'enregistrement, un audiophile. </BaseParagraph>
      </div>
    </section>

    <section class="about-card">
      <div class="full-height flex-row flex-around">
        <div class="flex-column">
          <i class="fas fa-edit fa-3x"></i>
          <BaseHeader html-type="h4">Ecrivez autant que vous le voulez</BaseHeader>
          <BaseParagraph class="p-center">Avec un compte, vous pourrez écrire tous les articles que vous souhaitez</BaseParagraph>
        </div>
        <div class="flex-column">
          <i class="far fa-newspaper fa-3x"></i>
          <BaseHeader html-type="h4">Un flux d'articles personnalisé</BaseHeader>
          <BaseParagraph class="p-center">Retrouvez facilement des articles sur les thèmes qui vous passionnent avec les tags</BaseParagraph>
        </div>
        <div class="flex-column">
          <i class="fas fa-users fa-3x"></i>
          <BaseHeader html-type="h4">Intéragissez avec la communauté</BaseHeader>
          <BaseParagraph class="p-center">Une remarque à faire sur un article ? Ou envie d'encourager un auteur ? C'est possible avec un commentaire ou en laissant un <i class="fas fa-heart" style="color: red"></i></BaseParagraph>
        </div>
      </div>
    </section>

    <section class="about-footer">
      <div class="flex-column">
        <BaseHeader html-type="h2">Envie de partager avec d'autres passionnés de la musique ?</BaseHeader>
        <BaseLink :link="joinJamLink">{{joinJamLink.title}}</BaseLink>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseHeader from '../components/Atoms/Typography/Header/BaseHeader.vue'
import BaseButton from '../components/Atoms/Button/BaseButton.vue'
import BaseParagraph from '../components/Atoms/Typography/Paragraph/BaseParagraph.vue'
import BaseLink from '../components/Atoms/Link/BaseLink.vue'
import BaseLinkModele from '../components/Atoms/Link/BaseLinkModele'

export default defineComponent({
  name: 'LoginPage',
  layout: "fullWidth",
  components: {
    BaseHeader,
    BaseButton,
    BaseParagraph,
    BaseLink
  },
  setup(){
    const createAccountLink: BaseLinkModele = new BaseLinkModele(
      ['signin?from=createAccount'],
      'Se créer un compte',
      true,
      '',
      ['btn', 'btn-success', 'btn-outline']
    )

    const joinJamLink: BaseLinkModele = new BaseLinkModele(
      ['signin?from=joinJam'],
      'Rejoindre le jam',
      true,
      '',
      ['btn', 'btn-success', 'btn-outline']
    )

    return{
      createAccountLink, joinJamLink
    }
  }
})
</script>

<style scoped>
  .full-height{
    min-height: calc(100vh - 84px);
  }

  section.about-header > h1 {
    margin-left: 24px;
  }

  section.about-header > div.description{
    margin-left: 24px;
    margin-bottom: 10%;
    width: 50%;
  }

  section.about-header > div.flex-column{
    height: 100%;
  }

  section.about-header > div.description > p{
    font-size: 24px;
  }

  section.bg-white{
    min-height: 33vh;
  }

  section.bg-white > div{
    width: 70vw;
  }

  section.about-footer{
    margin-bottom: 84px;
  }

  section.about-card > div.flex-row > div.flex-column{
    max-width: 30%;
    background-color: white;
    height: 240px;
    border-radius: 10px;
  }

  section.about-card > div.flex-row > div.flex-column > p{
    padding: 0 6px 0 6px;
  }

  a.btn {
    display: inline-block;
    font-weight: 400;
    text-decoration: none;
    color: #212529;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.333333;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 0.4285rem;
    padding: 11px 40px;
    margin: 4px;
    -webkit-transition: color 0.15s ease-in-out,
    background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
    -o-transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  }

  a.btn.btn-success {
    color: white;
    background-color: var(--success_bg);
    border-color: var(--success_border);
  }

  a.btn.btn-success:hover {
    text-decoration: none;
    background-color: var(--success_bg_hover);
    border-color: var(--success_border_hover);
  }

  a.btn.btn-success.btn-outline {
    color: var(--success_bg);
    background-color: transparent;
  }
  a.btn.btn-success.btn-outline:hover {
    color: white;
    text-decoration: none;
    background-color: var(--success_bg);
    border-color: var(--success_border);
  }

  @media only screen and (max-width: 1024px) {
    section.about-header > h1{
      font-size: 32px;
    }

    section.about-header > div.flex-column > h2,
    section.about-footer > div.flex-column > h2{
      margin-left: 24px;
    }

    section.about-header > div.description{
      width: 90%;
    }

    section.about-card > div.flex-row > div.flex-column{
      max-width: 90%;
      margin: 12px 0 12px 0;
    }
    
  }

</style>
