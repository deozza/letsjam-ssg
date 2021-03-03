<template>
  <div
    class="article-card flex-column flex-left"
  >
    <div class="card-header">
      <div class="load-author"></div>
      <div class="load-date"></div>
    </div>
    <div class="card-content">
      <div class="load-title"></div>

    </div>
    <div class="card-header">
      <div class="flex-row flex-left">
        <div class="load-likes"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BaseCardVue',
})
</script>

<style scoped>
div.article-card {
  background-color: white;
  padding: 12px 0;
  margin-bottom: 24px;
  border-radius: 3px;
  border: 1px solid var(--secondary_bg_hover);
  height: 150px;
}

div.article-card > div.card-content {
  padding: 0 58px;
  width: calc(100% - 116px);
}

div.article-card > div.card-header {
  padding-left: 24px;
  width: 100%;
}

div.article-card > div.card-content > .load-title {
  width: 100%;
  height: 24px;
  animation: animateBg 2s infinite linear;
  background-image: linear-gradient(90deg, rgb(180,180,180), rgb(230,230,230), rgb(180,180,180), rgb(230,230,230));
  background-size: 300% 100%;
  margin-bottom: 24px;
}

div.article-card > div.card-header > div.load-author {
  width: 10%;
  height: 12px;
  animation: animateBg 2s infinite linear;
  background-image: linear-gradient(90deg, rgb(180,180,180), rgb(230,230,230), rgb(180,180,180), rgb(230,230,230));
  background-size: 300% 100%;
  margin-bottom: 6px;
}

div.article-card > div.card-header > div.load-date {
  width: 20%;
  height: 12px;
  animation: animateBg 2s infinite linear;
  background-image: linear-gradient(90deg, rgb(180,180,180), rgb(230,230,230), rgb(180,180,180), rgb(230,230,230));
  background-size: 300% 100%;
  margin-bottom: 24px;
}

div.article-card > div.card-header  div.load-likes {
  width: 10%;
  height: 12px;
  animation: animateBg 2s infinite linear;
  background-image: linear-gradient(90deg, rgb(180,180,180), rgb(230,230,230), rgb(180,180,180), rgb(230,230,230));
  background-size: 300% 100%;
}

@keyframes animateBg {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@media only screen and (max-width: 1024px) {
  div.article-card > div.card-content {
    padding: 0 6px;
    width: calc(100% - 12px);
  }

  div.article-card > div.card-header {
    padding-left: 6px;
  }
}
</style>
