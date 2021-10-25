<template>
  <VChip
    :light="!$vuetify.theme.dark"
    :class="[
      $vuetify.theme.dark
        ? 'grey lighten-4 grey--text text--darken-3'
        : 'grey darken-4 grey--text text--lighten-3',
    ]"
    style="position: fixed; bottom: 60px; left: 10px; z-index: 5"
    >{{ currentCounter ? currentCounter.counter : 'Initializing...' }}</VChip
  >
</template>

<script lang="ts">
export default defineComponent({
  props: {
    currentCounter: {
      type: Object,
      default: null,
      required: false,
    },
  },
});
</script>
