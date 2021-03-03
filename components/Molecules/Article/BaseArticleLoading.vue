<template>
  <div
    class="article-tile"
  >
    <div class="load-title"></div>

    <div class="header">
      <div class="load-author"></div>
      <div class="load-date"></div>
    </div>
    <div class="load-title"></div>
    <div class="load-title"></div>
    <div class="load-title"></div>
    <div class="load-title"></div>
    <div class="load-title"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BaeArticleLoadingVue',
})
</script>

<style scoped>
div.article-tile {
  background-color: white;
  padding: 12px 24px;
  margin-bottom: 24px;
  border-radius: 3px;
}

.load-title {
  width: 100%;
  height: 24px;
  animation: animateBg 2s infinite linear;
  background-image: linear-gradient(90deg, rgb(180,180,180), rgb(230,230,230), rgb(180,180,180), rgb(230,230,230));
  background-size: 300% 100%;
  margin-bottom: 24px;
}

.load-author {
  width: 10%;
  height: 24px;
  animation: animateBg 2s infinite linear;
  background-image: linear-gradient(90deg, rgb(180,180,180), rgb(230,230,230), rgb(180,180,180), rgb(230,230,230));
  background-size: 300% 100%;
  margin-bottom: 24px;
}

.load-date {
  width: 20%;
  height: 24px;
  animation: animateBg 2s infinite linear;
  background-image: linear-gradient(90deg, rgb(180,180,180), rgb(230,230,230), rgb(180,180,180), rgb(230,230,230));
  background-size: 300% 100%;
  margin-bottom: 24px;
}


@keyframes animateBg {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}
</style>
