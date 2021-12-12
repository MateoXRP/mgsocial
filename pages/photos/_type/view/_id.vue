<template>
  <VCard :loading="isLoading" elevation="1">
    <VCardTitle>
      <VSpacer />
      <VBtn text @click="$router.go(-1)"
        >Back to {{ $route.params.type }} Photos</VBtn
      ></VCardTitle
    >
    <VCardText>
      <AppImgWithPlaceholder
        v-if="data"
        class="grey lighten-2"
        :src="data.payload.photo.image_url"
      />
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import { usePhotoDetail } from '~/composables';
import AppImgWithPlaceholder from '~/components/AppImgWithPlaceholder.vue';

export default defineComponent({
  components: { AppImgWithPlaceholder },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const { data, isLoading } = usePhotoDetail(route.value.params.id);

    return {
      data,
      isLoading,
    };
  },
});
</script>
