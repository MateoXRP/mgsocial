<template>
  <VCard>
    <VCardTitle>
      Friends
      <VSpacer />
      <VBtn
        v-if="$route.params.username === $store.state.auth.user.username"
        text
        color="primary"
        nuxt
        to="/friends"
        >Friend Requests</VBtn
      >
    </VCardTitle>
    <VList v-if="isLoading">
      <VSkeletonLoader
        v-for="n in 10"
        :key="n"
        v-bind="$attrs"
        type="list-item-avatar-two-line"
      ></VSkeletonLoader>
    </VList>
    <div v-else-if="isError" class="pb-4">
      <FetchErrorAction :is-loading="isFetching" @refetch="refetch" />
    </div>
    <VList v-else two-line>
      <VListItem
        v-for="friend in friends"
        :key="friend.guid"
        :to="`/u/${friend.username}`"
      >
        <VListItemAvatar>
          <VImg :src="friend.icon.small"></VImg>
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>{{
            $decodeHTMLEntities(friend.username)
          }}</VListItemTitle>
          <VListItemSubtitle
            >{{ friend.first_name }} {{ friend.last_name }}</VListItemSubtitle
          >
        </VListItemContent>
        <VListItemAction
          v-if="$route.params.username === $store.state.auth.user.username"
        >
          <VBtn
            :loading="unfriendQueue.includes(friend.guid)"
            depressed
            color="accent"
            @click="unfriend(friend.guid)"
            >Unfriend</VBtn
          >
        </VListItemAction>
      </VListItem>
    </VList>
    <AppInfiniteScroll v-if="friends.length" @infinite="infiniteHandler">
      <template #placeholder>
        <VSkeletonLoader
          v-for="n in 10"
          :key="n"
          v-bind="$attrs"
          type="list-item-avatar-two-line"
        ></VSkeletonLoader>
      </template>
    </AppInfiniteScroll>
  </VCard>
</template>

<script lang="ts">
import { useFriendList, useSnackbar } from '~/composables';
import FetchErrorAction from '~/components/FetchErrorAction.vue';
import AppInfiniteScroll from '~/components/AppInfiniteScroll.vue';
import type { InfiniteHandler } from '~/types';
import { useRemoveFriend } from '~/composables/useRemoveFriend';

export default defineComponent({
  components: { AppInfiniteScroll, FetchErrorAction },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    useMeta({
      title: route.value.params.username,
    });

    const {
      isLoading,
      data: friends,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      isError,
      isFetching,
      refetch,
    } = useFriendList(route.value.params.username);
    const removeFriend = useRemoveFriend();
    const unfriendQueue = ref<string[]>([]);
    const showSnackbar = useSnackbar();

    const unfriend = async (userId: string) => {
      unfriendQueue.value.push(userId);
      try {
        await removeFriend.mutateAsync(userId);
        showSnackbar('Unfriend success');
      } catch (e) {
        showSnackbar('An error occurred');
      }
      const idx = unfriendQueue.value.indexOf(userId);
      unfriendQueue.value.splice(idx, 1);
    };

    const isUnfriendLoading = computed(() => removeFriend.isLoading.value);

    const infiniteHandler = async ($state: InfiniteHandler) => {
      if (hasNextPage?.value && !isFetchingNextPage.value) {
        await fetchNextPage.value();
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    return {
      isLoading,
      friends,
      infiniteHandler,
      isError,
      isFetching,
      refetch,
      unfriend,
      unfriendQueue,
      isUnfriendLoading,
    };
  },
  head: {},
});
</script>
