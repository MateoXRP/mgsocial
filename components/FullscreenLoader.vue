<template>
  <VOverlay :z-index="250" :value="$accessor.isFullscreenLoaderOpen">
    <VProgressCircular indeterminate size="64" />
  </VOverlay>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    return {};
  },
});
</script>
