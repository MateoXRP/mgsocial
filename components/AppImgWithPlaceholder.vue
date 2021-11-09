<template>
  <VImg :src="src">
    <template #placeholder>
      <VRow class="fill-height ma-0" align="center" justify="center">
        <VProgressCircular indeterminate color="grey lighten-5" />
      </VRow>
    </template>
  </VImg>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
