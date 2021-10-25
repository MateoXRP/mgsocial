<template>
  <div :class="`preview ${backgroundColor}`" @click="openWebsite">
    <VImg :src="ogImage" max-height="350">
      <template #placeholder>
        <VRow class="fill-height ma-0" align="center" justify="center">
          <VProgressCircular
            indeterminate
            color="grey lighten-5"
          ></VProgressCircular>
        </VRow>
      </template>
    </VImg>
    <div class="px-4 py-2">
      <div
        class="text-body-1 font-weight-medium"
        v-text="ogResult.ogTitle"
      ></div>
      <div
        v-if="ogResult.ogDescription"
        class="text-body-2 text-truncate hidden-sm-and-down"
        v-text="ogResult.ogDescription"
      ></div>
      <div style="font-size: 13px" v-text="nakedDomain"></div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import { OGSuccessResponse } from '~/composables';

export default defineComponent({
  name: 'PostItemOpenGraphPreview',
  props: {
    ogResult: {
      required: true,
      type: Object as PropType<OGSuccessResponse>,
    },
  },
  setup(props) {
    const context = useContext();

    const openWebsite = () => {
      window.open(props.ogResult.ogUrl, '_blank');
    };

    const nakedDomain = computed(() => {
      const domain = new URL(props.ogResult.ogUrl);
      return domain.hostname.replace('www.', '');
    });

    const backgroundColor = computed(() => {
      const { dark } = context.$vuetify.theme;

      return dark ? 'grey darken-3' : 'grey lighten-3';
    });

    const ogImage = computed(() => {
      if (props.ogResult.ogImage instanceof Array) {
        return props.ogResult.ogImage[0].url;
      }

      return props.ogResult.ogImage.url;
    });

    return {
      openWebsite,
      nakedDomain,
      backgroundColor,
      ogImage,
    };
  },
});
</script>

<style scoped>
.preview {
  cursor: pointer;
  border-top: 1px solid black;
}
</style>
