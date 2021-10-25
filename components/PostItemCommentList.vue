<template>
  <div class="mt-2">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="d-flex align-start mt-2"
    >
      <VAvatar size="32">
        <VImg :src="comment.user.icon.small" />
      </VAvatar>
      <div class="ml-3">
        <NuxtLink class="nuxt-link text-subtitle-2" to="/">{{
          comment.user.username
        }}</NuxtLink>
        <div
          v-dompurify-html="
            comment['comments:post']
              ? comment['comments:post']
              : comment['comments:entity']
          "
        ></div>
        <div v-if="comment['file:comment:photo']">
          <VImg
            class="mt-2 rounded"
            width="150"
            :src="generateImageUrl(comment.id, comment['file:comment:photo'])"
            alt="No photo description available."
          />
        </div>
        <div
          :class="['d-flex', comment['file:comment:photo'] ? 'mt-1' : 'mt-0']"
        >
          <span class="text-caption">{{
            $dateUtils.timeAgo(comment.time_created, true)
          }}</span>
          &nbsp;·&nbsp;
          <span
            v-if="comment.is_liked_by_user"
            :class="[
              'hover-underline text-caption font-weight-medium primary--text text-capitalize mr-2',
              getColorByReaction(likeText(comment.reactions)),
            ]"
            @click="handleReactionClick(ReactionType.Like, comment)"
            >{{ likeText(comment.reactions) }}</span
          >
          <AppReactionMenu
            v-else
            v-slot="{ activator }"
            top
            @onReactionSelect="handleReactionClick($event, comment)"
          >
            <span
              v-bind="activator.attrs"
              class="hover-underline text-caption font-weight-medium mr-2"
              v-on="activator.on"
              @click="handleReactionClick(ReactionType.Like, comment)"
              >Like</span
            >
          </AppReactionMenu>
          <PostItemReactionSummaryDialog
            v-if="comment.total_likes > 0"
            :id="comment.id"
            type="annotation"
            :reactions="comment.reactions"
            :total-likes="comment.total_likes"
          />
        </div>
      </div>
      <PostItemCommentListItemMenu :post-id="postId" :comment="comment" />
    </div>
    <VBtn
      v-if="!isLoading && hasNextPage"
      :loading="isFetchingNextPage"
      :disabled="isFetchingNextPage"
      text
      class="ml-4 show-more-btn text-body-2"
      @click="loadMore"
      >Load more comments</VBtn
    >
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import PostItemCommentListItemMenu from './PostItemCommentListItemMenu.vue';
import AppReactionMenu from './AppReactionMenu.vue';
import PostItemReactionSummaryDialog from './PostItemReactionSummaryDialog.vue';
import {
  ReactionType,
  useCurrentUserId,
  useLikeComment,
  CommentRecord,
  useSnackbar,
} from '~/composables';
import { useCommentList } from '~/composables/useCommentList';

import getColorByReaction from '~/utils/get-color-by-reaction';

export default defineComponent({
  name: 'PostItemCommentList',
  components: {
    PostItemCommentListItemMenu,
    AppReactionMenu,
    PostItemReactionSummaryDialog,
  },
  props: {
    postId: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<'post' | 'entity'>,
      required: true,
    },
  },
  emits: ['update:isCommentListLoading'],
  setup(props, { emit }) {
    const {
      data: comments,
      hasNextPage,
      isLoading,
      fetchNextPage,
      isFetchingNextPage,
    } = useCommentList(props.postId, props.type);
    const currentUserId = useCurrentUserId();
    const { $config } = useContext();
    const likeComment = useLikeComment();
    const createSnackbar = useSnackbar();

    const loadMore = () => {
      if (hasNextPage?.value && !isFetchingNextPage.value) {
        fetchNextPage.value();
      }
    };

    watchEffect(() => {
      emit('update:isCommentListLoading', isLoading.value);
    });

    const generateImageUrl = (commentId: string, src: string) => {
      return `${$config.mgSocialUrl}/comment/image/${commentId}/${src.replace(
        'comment/photo/',
        ''
      )}`;
    };

    const isLikeLoading = computed(() => likeComment.isLoading.value);

    const handleReactionClick = async (
      reaction: ReactionType,
      comment: CommentRecord
    ) => {
      if (isLikeLoading.value) {
        createSnackbar('Please wait');
        return;
      }

      try {
        await likeComment.mutateAsync({
          commentId: comment.id,
          action: comment.is_liked_by_user ? 'unlike' : 'like',
          reaction,
          subjectId: comment.subject_guid,
        });
      } catch (e) {
        createSnackbar('An error occurred. Please try again.');
      }
    };

    const likeText = (reactions: CommentRecord['reactions']) => {
      const reactionIndex = reactions.findIndex(
        (i) => i.guid === currentUserId.value
      );

      if (reactionIndex !== -1) {
        return reactions[reactionIndex].subtype as ReactionType;
      }

      return 'like' as ReactionType;
    };

    return {
      comments,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      loadMore,
      currentUserId,
      generateImageUrl,
      handleReactionClick,
      likeText,
      ReactionType,
      getColorByReaction,
    };
  },
});
</script>

<style>
.show-more-btn {
  text-transform: unset !important;
}
</style>
