<template>
  <div class="mt-1">
    <VBtn
      v-if="isLikedByCurrentUser"
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
    <VBtn text class="social-btn mr-1">
      <VIcon left>mdi-share-outline</VIcon>
      Share
    </VBtn>
    <PostItemTipDialog
      v-if="xummAddress && currentUserId !== userId"
      :xumm-address="xummAddress"
      :user-id="userId"
      :post-id="postId"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import PostItemTipDialog from './PostItemTipDialog.vue';
import AppReactionMenu from './AppReactionMenu.vue';
import ReactionIcons from './ReactionIcons.vue';
import { ReactionType, useCurrentUserId, useLikePost } from '~/composables';
import type { Reaction } from '~/composables';
import getColorByReaction from '~/utils/get-color-by-reaction';

export default defineComponent({
  name: 'PostItemSocialActions',
  components: { PostItemTipDialog, AppReactionMenu, ReactionIcons },
  props: {
    postId: {
      type: String,
      required: true,
    },
    postType: {
      type: String as PropType<'entity' | 'post'>,
      required: true,
    },
    isLikedByCurrentUser: {
      type: Boolean,
      required: true,
    },
    reactions: {
      type: Array as PropType<Reaction[]>,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    xummAddress: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['update:showCommentSection'],
  setup(props) {
    const likePost = useLikePost();
    const currentUserId = useCurrentUserId();

    const handleReactionClick = (reaction: ReactionType) => {
      likePost.mutateAsync({
        postId: props.postId,
        type: props.postType,
        action: props.isLikedByCurrentUser ? 'unlike' : 'like',
        reaction_type: reaction,
        userId: props.userId,
      });
    };

    const selectedIcon = computed(() => {
      const reaction = props.reactions.find(
        (i) => i.guid === currentUserId.value
      );

      return props.isLikedByCurrentUser && reaction
        ? (reaction.subtype as ReactionType)
        : ReactionType.Like;
    });

    const isLikeLoading = computed(() => likePost.isLoading.value);

    return {
      handleReactionClick,
      ReactionType,
      selectedIcon,
      getColorByReaction,
      isLikeLoading,
      currentUserId,
    };
  },
});
</script>
