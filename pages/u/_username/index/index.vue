<template>
  <AppFragment>
    <template v-if="isLoading">
      <PostItemSkeleton v-for="n in 10" :key="n" />
    </template>
    <template v-if="isError">
      <NewsFeedError @refetch="refetch" />
    </template>
    <template v-else>
      <VRow dense>
        <VCol v-for="post in posts" :key="post.post.guid" cols="12">
          <PostItem :post="post" />
        </VCol>
      </VRow>
      <AppInfiniteScroll v-if="posts.length" @infinite="infiniteHandler">
        <template #placeholder>
          <PostItemSkeleton v-for="n in 5" :key="n" />
        </template>
      </AppInfiniteScroll>
    </template>
  </AppFragment>
</template>

<script lang="ts">
import PostItem from '~/components/PostItem.vue';
import PostItemSkeleton from '~/components/PostItemSkeleton.vue';
import NewsFeedError from '~/components/NewsFeedError.vue';

import { useUserDetail, useUserPostList } from '~/composables';
import AppInfiniteScroll from '~/components/AppInfiniteScroll.vue';
import { InfiniteHandler } from '~/types';

export default defineComponent({
  components: {
    PostItem,
    AppInfiniteScroll,
    PostItemSkeleton,
    NewsFeedError,
  },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const username = route.value.params.username;
    useMeta({
      title: username,
    });
    const { data: user } = useUserDetail(username);
    const userId = computed(() => (user.value ? user.value.guid : null));
    const {
      data: posts,
      isLoading,
      refetch,
      isError,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
    } = useUserPostList(userId);

    const infiniteHandler = async ($state: InfiniteHandler) => {
      if (hasNextPage?.value && !isFetchingNextPage.value) {
        await fetchNextPage.value();
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    watchEffect(() => {
      console.log('posts', posts.value);
    });

    return {
      isLoading,
      isError,
      posts,
      infiniteHandler,
      refetch,
    };
  },
  head: {},
});
</script>
