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
            <NuxtLink :to="`/photos/${$route.params.type}/view/${photo.guid}`">
              <AppImgWithPlaceholder
                :src="photo.image_url"
                aspect-ratio="1"
                class="grey lighten-2"
              />
            </NuxtLink> </VCol
        ></VRow>
      </VFadeTransition>
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import { useProfileOrCoverAlbumPhotoList } from '~/composables';
import AppImgWithPlaceholder from '~/components/AppImgWithPlaceholder.vue';

export default defineComponent({
  components: {
    AppImgWithPlaceholder,
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
