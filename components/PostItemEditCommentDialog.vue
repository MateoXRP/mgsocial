<template>
  <VDialog v-model="dialog" max-width="500">
    <template #activator="{ on, attrs }">
      <VListItem v-bind="attrs" v-on="on">
        <VListItemTitle>Edit</VListItemTitle>
      </VListItem>
    </template>
    <VCard>
      <VCardTitle>Edit comment</VCardTitle>
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
import type { PropType } from '@nuxtjs/composition-api';
import { CommentRecord, useSnackbar, useUpdateComment } from '~/composables';
import decodeHTMLEntities from '~/utils/decode-html-entities';

export default defineComponent({
  name: 'EditPostDialog',
  props: {
    postId: {
      type: String,
      required: true,
    },
    comment: {
      type: Object as PropType<CommentRecord>,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const updatedText = ref(decodeHTMLEntities(props.comment['comments:post']));
    const showSnackbar = useSnackbar();
    const updateComment = useUpdateComment();

    const savePost = async () => {
      try {
        await updateComment.mutateAsync({
          id: props.comment.id,
          comment: updatedText.value,
          type: props.comment.type === 'comments:post' ? 'post' : 'entity',
          postId: props.postId,
          subjectId: props.comment.subject_guid,
        });

        showSnackbar('Comment updated successfully');
        dialog.value = false;
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

    watch(dialog, (val) => {
      if (!val) {
        updatedText.value = decodeHTMLEntities(props.comment['comments:post']);
      }
    });

    const isLoading = computed(() => updateComment.isLoading.value);

    return {
      dialog,
      updatedText,
      isLoading,
      savePost,
    };
  },
});
</script>
