<template>
  <VCard class="mx-4" outlined flat>
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
            ></VListItemTitle
          >
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
          </VListItemSubtitle>
        </VListItemContent>
      </VListItem>
    </VList>
    <VCardText class="px-0 pb-1">
      <div
        v-if="postText !== ''"
        v-dompurify-html="linkifiedPostText"
        class="mb-2 mx-4"
      />
      <VImg
        v-if="imageUrl"
        class="mt-3 cursor-pointer"
        :src="imageUrl"
        aspect-ratio="1.7"
        contain
        @click="$router.push(`/post/view/${post.post.guid}`)"
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
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import PostItemOpenGraphPreview from './PostItemOpenGraphPreview.vue';
import { PostRecord, useOpenGraphScraper } from '~/composables';
import decodeHTMLEntities from '~/utils/decode-html-entities';
import linkify from '~/utils/linkify-string';

export default defineComponent({
  name: 'PostItem',
  components: { PostItemOpenGraphPreview },
  props: {
    post: {
      type: Object as PropType<PostRecord>,
      required: true,
    },
  },
  setup(props) {
    const { $config } = useContext();
    const { data: ogResult, isLoading: ogIsLoading } = useOpenGraphScraper(
      decodeHTMLEntities(JSON.parse(props.post.post.description).post),
      props.post.post.guid
    );
    const postText = computed(() => {
      if (props.post.text !== 'null:data') {
        return decodeHTMLEntities(JSON.parse(props.post.post.description).post);
      }
      return '';
    });
    const linkifiedPostText = computed(() => linkify(postText.value));
    const taggedFriends = computed(() => {
      if (props.post?.friends?.length) return false;
      return props.post?.friends?.map((friend) => friend.username).join(', ');
    });
    const isPublic = computed(() => props.post.post.access === '2');
    const imageUrl = computed(() => {
      if (!props.post.post['file:wallphoto']) {
        return false;
      }
      return `${$config.mgSocialUrl}/post/photo/${props.post.post.guid}/${props.post.image}`;
    });
    return {
      taggedFriends,
      isPublic,
      linkifiedPostText,
      postText,
      imageUrl,
      ogResult,
      ogIsLoading,
    };
  },
});
</script>
