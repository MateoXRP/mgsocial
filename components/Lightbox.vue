<template>
  <ClientOnly>
    <VueEasyLightbox
      :visible="isOpen"
      :imgs="imageUrl"
      :index="0"
      :move-disabled="true"
      @hide="hide"
    />
  </ClientOnly>
</template>

<script lang="ts">
import VueEasyLightbox from 'vue-easy-lightbox';
import { useLightbox } from '~/composables';

export default defineComponent({
  name: 'Lightbox',
  components: { VueEasyLightbox },
  setup() {
    const { imageUrl, isOpen, hide } = useLightbox();

    return {
      imageUrl,
      isOpen,
      hide,
    };
  },
});
</script>
