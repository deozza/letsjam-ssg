<template>
  <p :class="[{ [`p-${visualType}`]: visualType }]">
    <slot></slot>
  </p>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    visualType: {
      type: String as () => string,
      required: false,
      default: 'light',
      validator(value: string): boolean {
        const expectedValues: Array<string> = [
          'light',
          'dark',
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info',
        ]
        return expectedValues.includes(value)
      },
    },
  },
})
</script>

<style scoped>
p.p-light {
  color: black;
}
p.p-dark {
  color: white;
}

p.p-primary {
  color: var(--primary_text);
}

p.p-secondary {
  color: var(--secondary_text);
}

p.p-success {
  color: var(--success_text);
}

p.p-danger {
  color: var(--danger_text);
}

p.p-warning {
  color: var(--warning_text);
}

p.p-info {
  color: var(--info_text);
}

p.p-center{
  text-align: center;
}
</style>
