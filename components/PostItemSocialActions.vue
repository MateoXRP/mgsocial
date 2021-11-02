<template>
  <div class="mt-1">
    <VBtn
      v-if="post.post.is_liked_by_user"
      :class="['mr-1', getColorByReaction(selectedIcon)]"
      text
      :disabled="isLikeLoading"
      @click="handleReactionClick"
    >
      <ReactionIcons :icon="selectedIcon" />
      <span class="ml-3">{{ selectedIcon }}</span>
    </VBtn>
    <AppReactionMenu
      v-else
      v-slot="{ activator }"
      top
      @onReactionSelect="handleReactionClick"
    >
      <VBtn
        v-bind="activator.attrs"
        class="social-btn mr-1"
        text
        :disabled="isLikeLoading"
        v-on="activator.on"
        @click="handleReactionClick(ReactionType.Like)"
      >
        <VIcon left>mdi-thumb-up-outline</VIcon>
        Like
      </VBtn>
    </AppReactionMenu>
    <VBtn
      text
      class="social-btn mr-1"
      @click="$emit('update:showCommentSection', true)"
    >
      <VIcon left>mdi-comment-outline</VIcon>
      Comment
    </VBtn>
    <VBtn text class="social-btn mr-1" @click="share">
      <VIcon left>mdi-share-outline</VIcon>
      Share
    </VBtn>
    <PostItemTipDialog
      v-if="post.user.xummaddress && currentUserId !== post.user.guid"
      :xumm-address="post.user.xummaddress"
      :user-id="post.user.guid"
      :post-id="getPostId(post.post)"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import PostItemTipDialog from './PostItemTipDialog.vue';
import AppReactionMenu from './AppReactionMenu.vue';
import ReactionIcons from './ReactionIcons.vue';
import {
  ReactionType,
  useCurrentUserId,
  useDialog,
  useLikePost,
  useCreatePost,
  useCurrentUser,
  PostPrivacy,
  CreatePostBody,
  PostType,
  Monetized,
  PostRecord,
  useFullscreenLoader,
  useSnackbar,
} from '~/composables';
import getColorByReaction from '~/utils/get-color-by-reaction';
import { getPostId } from '~/utils/resource-id-helper';

export default defineComponent({
  name: 'PostItemSocialActions',
  components: { PostItemTipDialog, AppReactionMenu, ReactionIcons },
  props: {
    post: {
      type: Object as PropType<PostRecord>,
      required: true,
    },
  },
  emits: ['update:showCommentSection'],
  setup(props) {
    const user = useCurrentUser();
    const likePost = useLikePost();
    const currentUserId = useCurrentUserId();
    const createConfirmDialog = useDialog();
    const createPost = useCreatePost();
    const { show: showLoader, hide: hideLoader } = useFullscreenLoader();
    const createSnackbar = useSnackbar();

    const handleReactionClick = (reaction: ReactionType) => {
      const {
        post: { post, user },
      } = props;
      likePost.mutateAsync({
        postId: getPostId(post),
        type: post.item_type ? 'entity' : 'post',
        action: post.is_liked_by_user ? 'unlike' : 'like',
        reaction_type: reaction,
        userId: user.guid,
      });
    };

    const selectedIcon = computed(() => {
      const reaction = props.post.reactions.find(
        (i) => i.guid === currentUserId.value
      );

      return props.post.post.is_liked_by_user && reaction
        ? (reaction.subtype as ReactionType)
        : ReactionType.Like;
    });

    const isLikeLoading = computed(() => likePost.isLoading.value);

    const share = async () => {
      try {
        const shouldProceed = await createConfirmDialog(
          'Confirm',
          'Share this post?',
          { width: 300 }
        );
        if (shouldProceed) {
          showLoader();
          const {
            post: { post },
          } = props;

          const body: CreatePostBody = {
            owner_guid: user.value?.guid!,
            poster_guid: user.value?.guid!,
            type: PostType.User,
            privacy: PostPrivacy.Public,
            post: 'null:data',
            is_monetized: Monetized.Yes,
            item_type: 'post:share:post',
            item_guid: post.guid,
          };

          if (post.item_type === 'post:share:post') {
            // Get shared guid if this post is also a shared one.
            body.item_guid = post?.item_guid;
          }

          await createPost.mutateAsync(body);
          createSnackbar('Post shared');
          hideLoader();
        }
      } catch (_e) {}
    };

    return {
      handleReactionClick,
      ReactionType,
      selectedIcon,
      getColorByReaction,
      isLikeLoading,
      currentUserId,
      share,
      getPostId,
    };
  },
});
</script>
