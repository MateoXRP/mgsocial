<template>
  <VCard elevation="1">
    <VList two-line class="py-0">
      <VListItem>
        <VListItemAvatar
          class="cursor-pointer"
          @click="$router.push(`/u/${post.user.username}`)"
        >
          <VImg :src="post.user.icon.small" />
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>
            <NuxtLink class="nuxt-link" :to="`/u/${post.user.username}`">{{
              post.user.username
            }}</NuxtLink>
            <span v-if="taggedFriends"
              ><span class="font-weight-light">is with</span>
              {{ taggedFriends }}</span
            >
            <span v-else-if="isProfilePhotoPost">Changed profile photo</span>
            <span v-else-if="isCoverPhotoPost">Changed cover photo</span>
          </VListItemTitle>
          <VListItemSubtitle class="d-flex"
            ><NuxtLink
              class="nuxt-link mr-1"
              :to="`/post/view/${post.post.guid}`"
              >{{ $dateUtils.timeAgo(post.post.time_created) }}</NuxtLink
            >
            {{ post.location || '' }} ·
            <VIcon
              :title="isPublic ? 'Public' : 'Friends'"
              small
              color="grey"
              class="mx-1"
              >{{ isPublic ? 'mdi-earth' : 'mdi-account-multiple' }}</VIcon
            >
            <img
              v-if="isSelected"
              alt="wm-icon"
              width="12"
              src="/wm-icon.svg"
            />
          </VListItemSubtitle>
        </VListItemContent>
        <VListItemAction>
          <PostItemMenu
            :user-id="post.user.guid"
            :post-id="post.post.guid"
            :post-text="postText"
          />
        </VListItemAction>
      </VListItem>
    </VList>
    <VCardText
      :class="[
        'px-0',
        showCommentSection ? 'pb-2' : 'pb-1',
        isSharedPost ? 'pa-0' : '',
      ]"
    >
      <div
        v-if="postText !== ''"
        v-dompurify-html="linkifiedPostText"
        class="mb-2 mx-4"
      />

      <template v-if="post.post.item_type">
        <PostItemSharedPost
          v-if="isSharedPost && post.original"
          :post="post.original"
        />

        <VImg
          v-else-if="isCoverPhotoPost"
          class="mt-3 cursor-pointer"
          :src="post.post.profile_cover_url"
          aspect-ratio="1.7"
          contain
          @click="showImage(post.post.profile_cover_url)"
          ><template #placeholder>
            <VRow class="fill-height ma-0" align="center" justify="center">
              <VProgressCircular indeterminate color="grey lighten-5" />
            </VRow>
          </template>
        </VImg>

        <VImg
          v-else-if="isProfilePhotoPost"
          class="mt-3 cursor-pointer"
          :src="post.post.profile_photo_url"
          aspect-ratio="1.7"
          contain
          @click="showImage(post.post.profile_photo_url)"
          ><template #placeholder>
            <VRow class="fill-height ma-0" align="center" justify="center">
              <VProgressCircular indeterminate color="grey lighten-5" />
            </VRow>
          </template>
        </VImg>
      </template>

      <VImg
        v-if="imageUrl"
        class="mt-3 cursor-pointer"
        :src="imageUrl"
        aspect-ratio="1.7"
        contain
        @click="showImage(imageUrl)"
        ><template #placeholder>
          <VRow class="fill-height ma-0" align="center" justify="center">
            <VProgressCircular indeterminate color="grey lighten-5" />
          </VRow>
        </template>
      </VImg>
      <div
        v-else-if="
          ogResult &&
          ogResult.success &&
          (ogResult.ogImage || ogResult.twitterImage)
        "
        class="mt-3"
      >
        <PostItemOpenGraphPreview :og-result="ogResult" />
      </div>
      <div class="mx-4 mt-2">
        <div class="d-flex align-center justify-space-between">
          <PostItemReactionSummaryDialog
            v-if="post.post.total_likes > 0"
            :id="post.post.guid"
            :total-likes="post.post.total_likes"
            :reactions="post.reactions"
            type="post"
          />
          <div v-else />
          <div>
            <PostItemTipSummaryDialog
              v-if="isMonetized"
              :text="tipsText"
              :tips="tipsSummarized"
            />
            <span class="hover-underline" @click="showCommentSection = true"
              >{{ post.post.total_comments }} {{ commentsText }}</span
            >
          </div>
        </div>
        <VDivider class="mt-2" />
        <PostItemSocialActions
          :post="post"
          :show-comment-section.sync="showCommentSection"
        />
        <template v-if="showCommentSection">
          <VDivider class="mt-1" />
          <div v-if="isCommentListLoading" class="text-center py-4">
            <VProgressCircular indeterminate color="primary" />
          </div>
          <div v-show="!isCommentListLoading">
            <PostItemCommentList
              :post-id="getPostId(post.post)"
              :type="getPostType(post.post)"
              :is-comment-list-loading.sync="isCommentListLoading"
            />
            <PostItemCommentForm
              :post-id="getPostId(post.post)"
              :type="getPostType(post.post)"
              :item-guid="post.post.item_guid"
            />
          </div>
        </template>
      </div>
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import PostItemOpenGraphPreview from './PostItemOpenGraphPreview.vue';
import PostItemMenu from './PostItemMenu.vue';
import PostItemCommentList from './PostItemCommentList.vue';
import PostItemCommentForm from './PostItemCommentForm.vue';
import PostItemSocialActions from './PostItemSocialActions.vue';
import PostItemTipSummaryDialog from './PostItemTipSummaryDialog.vue';
import PostItemReactionSummaryDialog from './PostItemReactionSummaryDialog.vue';
import PostItemSharedPost from './PostItemSharedPost.vue';
import {
  PostRecord,
  useOpenGraphScraper,
  usePostTips,
  ReactionType,
  useLightbox,
} from '~/composables';
import linkify from '~/utils/linkify-string';
import { getPostId, getPostType } from '~/utils/resource-id-helper';
import decodeHTMLEntities from '~/utils/decode-html-entities';

export default defineComponent({
  name: 'PostItem',
  components: {
    PostItemOpenGraphPreview,
    PostItemMenu,
    PostItemCommentList,
    PostItemSocialActions,
    PostItemCommentForm,
    PostItemTipSummaryDialog,
    PostItemReactionSummaryDialog,
    PostItemSharedPost,
  },
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
    post: {
      type: Object as PropType<PostRecord>,
      required: true,
    },
  },
  setup(props) {
    const { post } = props;

    const { $config } = useContext();
    const loading = ref(false);
    const isCommentListLoading = ref(true);
    const showCommentSection = ref(false);
    const { show } = useLightbox();

    const { data: ogResult, isLoading: ogIsLoading } = useOpenGraphScraper(
      decodeHTMLEntities(JSON.parse(post.post.description).post),
      post.post.guid
    );

    const postText = computed(() => {
      if (post.text !== 'null:data') {
        return decodeHTMLEntities(post.text);
      }

      return '';
    });

    const linkifiedPostText = computed(() => linkify(postText.value));

    const imageUrl = computed(() => {
      if (!post.post['file:wallphoto']) {
        return false;
      }
      return `${$config.mgSocialUrl}/post/photo/${post.post.guid}/${post.image}`;
    });

    const showImage = (url: string | false | undefined) => {
      if (url) show(url);
    };

    const commentsText = computed(() =>
      post.post.total_comments > 1 || post.post.total_comments === 0
        ? 'comments'
        : 'comment'
    );

    const taggedFriends = computed(() => {
      if (!post?.friends?.length) return false;
      return post?.friends?.map((friend) => friend.username).join(', ');
    });

    const isPublic = computed(() => post.post.access === '2');
    const isMonetized = computed(
      () => JSON.parse(post.post.description).is_monetized
    );

    const originalPost = computed(() => {
      return post.original ? post.original : false;
    });

    const isSharedPost = computed(
      () => post.post.item_type === 'post:share:post'
    );
    const isCoverPhotoPost = computed(
      () => post.post.item_type === 'cover:photo'
    );
    const isProfilePhotoPost = computed(
      () => post.post.item_type === 'profile:photo'
    );

    return {
      loading,
      ogResult,
      ogIsLoading,
      postText,
      linkifiedPostText,
      imageUrl,
      showCommentSection,
      isCommentListLoading,
      getPostId,
      getPostType,
      commentsText,
      taggedFriends,
      isPublic,
      isMonetized,
      ReactionType,
      showImage,
      originalPost,
      isSharedPost,
      isCoverPhotoPost,
      isProfilePhotoPost,
      ...usePostTips(post),
    };
  },
});
</script>
