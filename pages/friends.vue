<template>
  <VCard>
    <VCardTitle> Friend Requests </VCardTitle>
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
      <VListItem v-for="request in requests" :key="request.guid">
        <VListItemAvatar>
          <VImg :src="request.icon.small"></VImg>
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>{{ request.username }}</VListItemTitle>
          <VListItemSubtitle
            >{{ request.first_name }} {{ request.last_name }}</VListItemSubtitle
          >
        </VListItemContent>
        <VListItemAction>
          <div>
            <VBtn
              depressed
              color="primary"
              class="mr-2"
              :loading="acceptRequestQueue.includes(request.guid)"
              :disabled="removeRequestQueue.includes(request.guid)"
              @click="acceptRequest(request.guid)"
              >Confirm</VBtn
            >
            <VBtn
              depressed
              color="accent"
              :loading="removeRequestQueue.includes(request.guid)"
              :disabled="acceptRequestQueue.includes(request.guid)"
              @click="declineRequest(request.guid)"
              >Delete Request</VBtn
            >
          </div>
        </VListItemAction>
      </VListItem>
    </VList>
    <AppInfiniteScroll v-if="requests.length" @infinite="infiniteHandler">
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
import { useFriendRequestList, useSnackbar } from '~/composables';
import { useCreateFriendRequest } from '~/composables/useCreateFriendRequest';
import { useRemoveFriend } from '~/composables/useRemoveFriend';
import AppInfiniteScroll from '~/components/AppInfiniteScroll.vue';
import type { InfiniteHandler } from '~/types';

export default defineComponent({
  components: { AppInfiniteScroll },
  layout: 'authenticated',
  setup() {
    const {
      data: requests,
      isError,
      isLoading,
      isFetching,
      refetch,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useFriendRequestList();
    const friendRequest = useCreateFriendRequest();
    const removeFriend = useRemoveFriend();
    const acceptRequestQueue = ref<string[]>([]);
    const removeRequestQueue = ref<string[]>([]);
    const showSnackbar = useSnackbar();

    const infiniteHandler = async ($state: InfiniteHandler) => {
      if (hasNextPage?.value && !isFetchingNextPage.value) {
        await fetchNextPage.value();
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    const declineRequest = async (userId: string) => {
      removeRequestQueue.value.push(userId);
      try {
        await removeFriend.mutateAsync(userId);
        showSnackbar('Friend request removed');
      } catch (e) {
        showSnackbar('An error occurred');
      }
      const idx = removeRequestQueue.value.indexOf(userId);
      removeRequestQueue.value.splice(idx, 1);
    };

    const acceptRequest = async (userId: string) => {
      acceptRequestQueue.value.push(userId);
      try {
        await friendRequest.mutateAsync({
          userId,
          action: 'accept',
        });
        showSnackbar('Friend request accepted');
      } catch (e) {
        showSnackbar('An error occurred');
      }
      const idx = acceptRequestQueue.value.indexOf(userId);
      acceptRequestQueue.value.splice(idx, 1);
    };

    return {
      requests,
      isLoading,
      isError,
      isFetching,
      refetch,
      infiniteHandler,
      acceptRequest,
      declineRequest,
      acceptRequestQueue,
      removeRequestQueue,
    };
  },
});
</script>
