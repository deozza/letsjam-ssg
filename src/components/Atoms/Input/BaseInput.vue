<template>
  <li class="flex-column">
    <div class="flex-row input-row">
      <label :for="input.id">{{input.label}} <span v-if="input.required" class="required-field">*</span></label>
      <input :type="input.type" :id="input.type" :name="input.name" :required="input.required" v-model="input.value">
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseInputModele from '~/components/Atoms/Input/BaseInputModele'

export default defineComponent({
  name: 'BaseInputVue',
  props: {
    input: {
      type: Object as () => BaseInputModele,
      required: true,
    },
  }
})
</script>

<style scoped>
li {
  margin: 12px 0;
}

li > div.input-row {
  padding: 0.5em;
  align-items: normal;
  width: 98%;
}

li > div.input-row > label {
  flex: 1;
  padding: 0.5em 1em 0.5em 0;
}

li > div.input-row >  label > span.required-field {
  margin-left: 6px;
  color: var(--danger_text);
}

li > div.input-row > input{
  flex: 2;
}


@media screen and (max-width: 760px) {
  li .flex-row {
    flex-direction: column;
  }
}
</style>
