<template>
  <AppFragment>
    <VMenu offset-y :disabled="currentUserId !== userId">
      <template #activator="{ on, attrs }">
        <VAvatar
          style="z-index: 2"
          class="cursor-pointer elevation-1"
          size="130px"
          v-bind="attrs"
          v-on="on"
          @click="currentUserId !== userId && viewImage(profilePhotoUrl)"
        >
          <VImg :src="profilePhotoUrl" alt="John" />
        </VAvatar>
      </template>
      <VList>
        <VListItem @click="viewImage(profilePhotoUrl)">
          <VListItemTitle>View Profile Picture</VListItemTitle>
        </VListItem>
        <VListItem @click="openFileSelector">
          <VListItemTitle>Update Profile Picture</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
    <VDialog v-model="dialog" max-width="600">
      <VCard>
        <VCardTitle>Your Profile Photo</VCardTitle>
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
  props: {
    userId: {
      type: String,
      required: true,
    },
    profilePhotoUrl: {
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
      type: 'profile',
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
        showSnackbar('Profile photo updated');
      } catch (e) {
        showSnackbar('Unable to update profile photo');
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
