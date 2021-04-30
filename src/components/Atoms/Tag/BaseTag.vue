<template>
  <span class="tag" @click="$emit('tagClick', tag)">
    <i v-if="tag.canAdd" class="fas fa-plus fa-1x"></i>
    <i v-else-if="tag.canRemove" class="fas fa-times"></i>
    {{tag.title}}
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseTagModele from '~/components/Atoms/Tag/BaseTagModele'

export default defineComponent({
  name: 'BaseTagVue',
  props: {
    tag: {
      type: Object as () => BaseTagModele,
      required: true,
    },
  },
})
</script>

<style scoped>
span.tag{
  background-color: var(--secondary_bg_hover);
  border: none;
  color: black;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: normal;
}
span.tag:hover{
  cursor: pointer;
}

</style>
