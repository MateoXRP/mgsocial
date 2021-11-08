<template>
  <VCard :loading="isLoading">
    <VCardTitle
      >{{ data ? data.payload.album.title : 'Fetching album photos' }}
    </VCardTitle>
    <VCardText>
      <VFadeTransition mode="out-in">
        <VRow
          ><VCol
            v-for="photo in photos"
            :key="photo.guid"
            class="d-flex child-flex"
            cols="3"
          >
            <VImg
              :src="photo.image_url"
              aspect-ratio="1"
              class="grey lighten-2"
              height="150"
            >
              <template #placeholder>
                <AppImagePlaceholder />
              </template>
            </VImg> </VCol
        ></VRow>
      </VFadeTransition>
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import { useAlbumPhotoList } from '~/composables';
export default defineComponent({
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const { data, isLoading } = useAlbumPhotoList(route.value.params.id);
    const photos = computed(() => {
      if (!data.value) return [];
      return data.value.payload.list || [];
    });
    return {
      data,
      isLoading,
      photos,
    };
  },
});
</script>
