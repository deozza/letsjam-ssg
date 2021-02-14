<template>
  <div
    class="alert"
    :class="[{ [`alert-${alert.visualType}`]: alert.visualType }]"
  >
    <span class="closebtn" onclick="this.parentElement.style.display='none';"
      >&times;</span
    >
    {{ alert.message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseAlertModele from '~/components/Atoms/Alert/BaseAlertModele'

export default defineComponent({
  name: 'BaseAlertVue',
  props: {
    alert: {
      type: Object as () => BaseAlertModele,
      required: true,
    },
  },
})
</script>

<style scoped>
.alert {
  padding: 20px;
  padding-top: 80px;
  color: white;
  margin-bottom: 15px;
}

/* The close button */
.closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

/* When moving the mouse over the close button */
.closebtn:hover {
  color: black;
}

div.alert-primary {
  background-color: var(--primary_bg);
}

div.alert-secondary {
  background-color: var(--secondary_bg);
}

div.alert-success {
  background-color: var(--success_bg);
}

div.alert-danger {
  background-color: var(--danger_bg);
}

div.alert-warning {
  background-color: var(--warning_bg);
}

div.alert-info {
  background-color: var(--info_bg);
}
</style>
