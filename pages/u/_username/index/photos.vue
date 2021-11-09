<template>
  <VFadeTransition mode="out-in">
    <VRow>
      <VCol class="d-flex child-flex" cols="3">
        <VCard :to="`/album/profile/${$route.params.username}`">
          <AppImgWithPlaceholder
            :src="profilePhotoAlbumCover"
            aspect-ratio="1"
            class="grey lighten-2"
            height="150"
          />
          <VCardTitle class="text-h6"> Profile Photos </VCardTitle>
        </VCard>
      </VCol>
      <VCol class="d-flex child-flex" cols="3">
        <VCard :to="`/album/cover/${$route.params.username}`">
          <AppImgWithPlaceholder
            :src="coverPhotoAlbumCover"
            aspect-ratio="1"
            class="grey lighten-2"
            height="150"
          />
          <VCardTitle class="text-h6"> Profile Covers </VCardTitle>
        </VCard>
      </VCol>
      <VCol
        v-for="album in albums"
        :key="album.album.guid"
        class="d-flex child-flex"
        cols="3"
      >
        <VCard :to="`/album/view/${album.album.guid}`">
          <AppImgWithPlaceholder
            :src="album.image_url"
            aspect-ratio="1"
            class="grey lighten-2"
            height="150"
          />
          <VCardTitle class="text-h6">
            {{ album.album.title }}
          </VCardTitle>
        </VCard>
      </VCol>
    </VRow>
  </VFadeTransition>
</template>

<script lang="ts">
import { AlbumRecord, useAlbumList } from '~/composables';
import AppImgWithPlaceholder from '~/components/AppImgWithPlaceholder.vue';

export default defineComponent({
  components: { AppImgWithPlaceholder },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const { data } = useAlbumList(route.value.params.username);
    const albums = computed(() => {
      return data.value
        ? ([] as AlbumRecord[]).concat(
            ...data.value.pages.map((page) => page.payload.albums ?? [])
          )
        : [];
    });
    const coverPhotoAlbumCover = computed(() => {
      if (!data.value) return '';
      return data.value.pages[0].payload.cover_photo;
    });
    const profilePhotoAlbumCover = computed(() => {
      if (!data.value) return '';
      return data.value.pages[0].payload.profile_photo;
    });
    return {
      albums,
      coverPhotoAlbumCover,
      profilePhotoAlbumCover,
    };
  },
});
</script>
