<template>
  <VDialog v-model="dialog" max-width="500">
    <template #activator="{ on, attrs }">
      <VListItem v-bind="attrs" v-on="on">
        <VListItemTitle>Edit</VListItemTitle>
      </VListItem>
    </template>
    <VCard>
      <VCardTitle>Edit post</VCardTitle>
      <VCardText>
        <VTextarea
          v-model="updatedText"
          outlined
          hide-details
          auto-grow
          no-resize
          @keydown.alt.enter.exact.prevent="savePost"
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" text @click="dialog = false"> Cancel </VBtn>
        <VBtn color="primary" text :loading="isLoading" @click="savePost">
          Save
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { useSnackbar } from '~/composables';
import { useUpdatePost } from '~/composables/useUpdatePost';

export default defineComponent({
  name: 'EditPostDialog',
  props: {
    postId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
      default: '',
    },
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const updatedText = ref(props.text);
    const showSnackbar = useSnackbar();
    const updatePost = useUpdatePost();

    const savePost = async () => {
      try {
        await updatePost.mutateAsync({
          guid: props.postId,
          post: updatedText.value,
        });
        showSnackbar('Post successfully updated');
        dialog.value = false;
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

    watch(dialog, (val) => {
      if (!val) {
        updatedText.value = props.text;
      }
    });

    const isLoading = computed(() => updatePost.isLoading.value);

    return {
      dialog,
      updatedText,
      isLoading,
      savePost,
    };
  },
});
</script>
