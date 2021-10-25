<template>
  <VMenu bottom left close-on-content-click>
    <template #activator="{ on, attrs }">
      <VBtn class="ml-1" icon small v-bind="attrs" v-on="on">
        <VIcon small>mdi-dots-horizontal</VIcon>
      </VBtn>
    </template>
    <VList min-width="200">
      <template v-if="currentUserId === comment.user.guid">
        <PostItemEditCommentDialog :post-id="postId" :comment="comment" />
        <VListItem @click="handleDelete">
          <VListItemTitle>Delete</VListItemTitle>
        </VListItem>
      </template>
      <!-- <PostItemReportDialog :post-id="postId" /> -->
    </VList>
  </VMenu>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import PostItemEditCommentDialog from './PostItemEditCommentDialog.vue';
import {
  useDialog,
  CommentRecord,
  useSnackbar,
  useCurrentUserId,
  useDeleteComment,
} from '~/composables';

export default defineComponent({
  name: 'PostItemCommentListItemMenu',
  components: {
    PostItemEditCommentDialog,
  },
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
    const currentUserId = useCurrentUserId();
    const createConfirmDialog = useDialog();
    const createSnackbar = useSnackbar();
    const deleteComment = useDeleteComment();

    const handleDelete = async () => {
      try {
        const shouldProceed = await createConfirmDialog(
          'Confirm',
          'Delete this comment?',
          { width: 300 }
        );
        if (shouldProceed) {
          await deleteComment.mutateAsync({
            commentId: props.comment.id,
            subjectId: props.comment.subject_guid,
            type: props.comment['comments:post'] ? 'post' : 'entity',
            postId: props.postId,
          });
          createSnackbar('Comment deleted successfully');
        }
      } catch (e) {
        createSnackbar('Unable to delete comment');
      }
    };

    return {
      currentUserId,
      handleDelete,
    };
  },
});
</script>
