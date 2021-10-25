<template>
  <AppFragment>
    <AppCoilCounter :current-counter="currentCounter" />
    <VRow>
      <VCol cols="12" md="8">
        <template v-if="isLoading">
          <PostItemSkeleton v-for="n in 10" :key="n" />
        </template>
        <template v-if="isError">
          <NewsFeedError @refetch="refetch" />
        </template>
        <template v-else>
          <VRow dense>
            <VCol
              v-for="post in posts"
              :key="post.post.guid"
              :data-paymentpointer="post.user.paymentpointer"
              :data-post-id="post.post.guid"
              :data-is-monetized="
                JSON.parse(post.post.description).is_monetized
              "
              cols="12"
            >
              <PostItem
                :is-selected="
                  selectedPostInViewport !== null &&
                  selectedPostInViewport.post.guid === post.post.guid
                "
                :post="post"
              />
            </VCol>
          </VRow>
          <AppInfiniteScroll v-if="posts.length" @infinite="handleInfinite">
            <template #placeholder>
              <PostItemSkeleton v-for="n in 5" :key="n" />
            </template>
          </AppInfiniteScroll>
        </template>
      </VCol>
      <VCol cols="12" md="4">
        <LatestFriendList />
        <LatestMemberList />
      </VCol>
    </VRow>
  </AppFragment>
</template>

<script lang="ts">
import PostItem from '~/components/PostItem.vue';
import LatestMemberList from '~/components/LatestMemberList.vue';
import LatestFriendList from '~/components/LatestFriendList.vue';
import PostItemSkeleton from '~/components/PostItemSkeleton.vue';
import NewsFeedError from '~/components/NewsFeedError.vue';
import AppInfiniteScroll from '~/components/AppInfiniteScroll.vue';
import { usePostList, usePostMonetization } from '~/composables';
import { InfiniteHandler } from '~/types';
import AppCoilCounter from '~/components/AppCoilCounter.vue';

export default defineComponent({
  components: {
    PostItem,
    LatestMemberList,
    LatestFriendList,
    PostItemSkeleton,
    NewsFeedError,
    AppInfiniteScroll,
    AppCoilCounter,
  },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const {
      isLoading,
      isError,
      data: posts,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
    } = usePostList(`#${route.value.params?.hashtag}`);

    const { selectedPostInViewport, currentCounter } =
      usePostMonetization(posts);

    const handleInfinite = async ($state: InfiniteHandler) => {
      if (hasNextPage?.value && !isFetchingNextPage.value) {
        await fetchNextPage.value();
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    return {
      isLoading,
      isError,
      refetch,
      posts,
      handleInfinite,
      selectedPostInViewport,
      currentCounter,
    };
  },
  head: {
    title: 'News Feed',
  },
});
</script>
