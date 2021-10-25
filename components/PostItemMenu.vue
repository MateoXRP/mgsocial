<template>
  <VMenu bottom left>
    <template #activator="{ on, attrs }">
      <VBtn icon v-bind="attrs" v-on="on">
        <VIcon>mdi-dots-horizontal</VIcon>
      </VBtn>
    </template>
    <VList min-width="200">
      <VListItem nuxt :to="`/post/view/${postId}`">
        <VListItemTitle>View post</VListItemTitle>
      </VListItem>
      <template v-if="currentUserId === userId">
        <EditPostDialog :text="postText" :user-id="userId" :post-id="postId" />
        <VListItem @click="handleDelete">
          <VListItemTitle>Delete</VListItemTitle>
        </VListItem>
      </template>
      <PostItemReportDialog :post-id="postId" />
    </VList>
  </VMenu>
</template>

<script lang="ts">
import PostItemReportDialog from './PostItemReportDialog.vue';
import EditPostDialog from './EditPostDialog.vue';
import {
  useDeletePost,
  useDialog,
  useSnackbar,
  useCurrentUserId,
} from '~/composables';

export default defineComponent({
  name: 'PostItemMenu',
  components: { PostItemReportDialog, EditPostDialog },
  props: {
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    postText: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const deletePostMutation = useDeletePost();
    const currentUserId = useCurrentUserId();
    const createConfirmDialog = useDialog();
    const createSnackbar = useSnackbar();

    const handleDelete = async () => {
      try {
        const shouldProceed = await createConfirmDialog(
          'Confirm',
          'Delete this post?',
          { width: 300 }
        );
        if (shouldProceed) {
          await deletePostMutation.mutateAsync(props.postId);
        }
      } catch (e) {
        createSnackbar('Unable to delete post');
      }
    };

    const showSnackbar = () => {
      createSnackbar('Test notification');
    };

    return {
      handleDelete,
      currentUserId,
      showSnackbar,
    };
  },
});
</script>
