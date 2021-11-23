<template>
  <AppFragment>
    <template v-if="isLoading">
      <PostItemSkeleton v-for="n in 5" :key="n" />
    </template>
    <template v-if="isError">
      <NewsFeedError @refetch="refetch" />
    </template>
    <template v-else>
      <VRow dense>
        <VCol v-for="post in data" :key="post._id" cols="12">
          <VCard>
            <VList two-line class="py-0">
              <VListItem>
                <VListItemAvatar>
                  <VImg :src="post.author.gravatarURL" />
                </VListItemAvatar>
                <VListItemContent>
                  <VListItemTitle>
                    <a
                      :href="`https://ps.mg.social/u/${post.author.account}`"
                      class="text-decoration-none"
                      target="_BLANK"
                      >{{ post.author.username }}</a
                    >
                  </VListItemTitle>
                  <VListItemSubtitle>
                    {{ $dayjs(post.date).fromNow() }}
                  </VListItemSubtitle>
                </VListItemContent>
              </VListItem>
            </VList>
            <VCardText>
              <div v-dompurify-html="post.content" />
              <div class="row mt-5">
                <div class="col-12 text-truncate">
                  Trans#
                  <a
                    class="text-decoration-none"
                    target="_BLANK"
                    :href="`https://xrpscan.com/tx/${post.hash}`"
                    >{{ post.hash }}</a
                  >
                </div>
              </div>
              <div>
                Amount: {{ post.amount.value }} {{ post.amount.currency }}
              </div>
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn
                text
                :href="`https://ps.mg.social/p/${post.hash}`"
                target="_BLANK"
              >
                View Post
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
      <AppInfiniteScroll v-if="data.length" @infinite="infiniteHandler">
        <template #placeholder>
          <PostItemSkeleton v-for="n in 5" :key="n" />
        </template>
      </AppInfiniteScroll>
    </template>
  </AppFragment>
</template>

<script lang="ts">
import { usePublicSquarePostList, useUserDetail } from '~/composables';
import PostItemSkeleton from '~/components/PostItemSkeleton.vue';
import NewsFeedError from '~/components/NewsFeedError.vue';
import AppInfiniteScroll from '~/components/AppInfiniteScroll.vue';
import type { InfiniteHandler } from '~/types';

export default defineComponent({
  components: { PostItemSkeleton, NewsFeedError, AppInfiniteScroll },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const { data: user } = useUserDetail(route.value.params.username);
    const xummAddress = computed(() =>
      user.value ? user.value.xummaddress : ''
    );
    const {
      data,
      isLoading,
      isError,
      refetch,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = usePublicSquarePostList(xummAddress);

    const infiniteHandler = async ($state: InfiniteHandler) => {
      if (hasNextPage?.value && !isFetchingNextPage.value) {
        await fetchNextPage.value();
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    return {
      data,
      isLoading,
      isError,
      refetch,
      infiniteHandler,
      xummAddress,
    };
  },
});
</script>
