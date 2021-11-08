<template>
  <VCard :loading="isLoading">
    <VCardTitle
      >{{ title }}
      <VSpacer />
      <VBtn text :to="`/u/${$route.params.username}/photos`"
        >Back to Photos</VBtn
      ></VCardTitle
    >
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
import { useProfileOrCoverAlbumPhotoList } from '~/composables';
import AppImagePlaceholder from '~/components/AppImagePlaceholder.vue';
export default defineComponent({
  components: {
    AppImagePlaceholder,
  },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const { data, isLoading } = useProfileOrCoverAlbumPhotoList({
      type: route.value.params.type as 'profile' | 'cover',
      username: route.value.params.username,
    });
    const photos = computed(() => {
      if (!data.value) return [];
      return data.value.payload.list || [];
    });
    const title = computed(() =>
      route.value.params.type === 'profile'
        ? 'Profile Photos'
        : 'Profile Covers'
    );
    return {
      title,
      isLoading,
      photos,
    };
  },
});
</script>
