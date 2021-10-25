<template>
  <AppFragment>
    <VMenu absolute offset-y :disabled="currentUserId !== userId">
      <template #activator="{ on, attrs }">
        <VImg
          :src="coverPhotoUrl"
          height="245"
          max-height="245"
          class="cursor-pointer"
          v-bind="attrs"
          style="z-index: 1"
          v-on="on"
          @click="currentUserId !== userId && viewImage(coverPhotoUrl)"
        />
      </template>
      <VList>
        <VListItem @click="viewImage(coverPhotoUrl)">
          <VListItemTitle>View Cover Photo</VListItemTitle>
        </VListItem>
        <VListItem @click="openFileSelector">
          <VListItemTitle>Update Cover Photo</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
    <VDialog v-model="dialog" max-width="600">
      <VCard>
        <VCardTitle>Your Cover Photo</VCardTitle>
        <VCardText>
          <VImg
            v-if="filesContent.length"
            contain
            :src="filesContent[0].content"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" text @click="reset">Cancel</VBtn>
          <VBtn color="primary" depressed @click="save">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </AppFragment>
</template>

<script lang="ts">
import {
  useCurrentUserId,
  useFilePicker,
  useFullscreenLoader,
  useLightbox,
  useSnackbar,
  useUpdateProfilePhoto,
} from '~/composables';

export default defineComponent({
  name: 'UserProfileHeader',
  props: {
    userId: {
      type: String,
      required: true,
    },
    coverPhotoUrl: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const currentUserId = useCurrentUserId();
    const { show: viewImage } = useLightbox();
    const { show: showLoader, hide: hideLoader } = useFullscreenLoader();
    const updateProfilePhoto = useUpdateProfilePhoto({
      type: 'cover',
      username: props.username,
    });
    const showSnackbar = useSnackbar();
    const { files, filesContent, openFileSelector, clear } = useFilePicker({
      accept: 'image/*',
      readAs: 'DataURL',
    });

    watch(files, (val) => {
      if (val.length) {
        dialog.value = true;
      }
    });

    const reset = () => {
      dialog.value = false;
      clear();
    };

    const save = async () => {
      showLoader();
      try {
        await updateProfilePhoto.mutateAsync({
          userphoto: files.value[0],
        });
        reset();
        showSnackbar('Cover photo updated');
      } catch (e) {
        showSnackbar('Unable to update cover photo');
      }
      hideLoader();
    };

    return {
      dialog,
      currentUserId,
      viewImage,
      openFileSelector,
      filesContent,
      reset,
      save,
    };
  },
});
</script>
