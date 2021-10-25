<template>
  <VCard>
    <VCardTitle> Latest Members </VCardTitle>
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
      <VListItem v-for="member in latestMembers" :key="member.guid">
        <VListItemAvatar>
          <VImg :src="member.icon.small"></VImg>
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>{{ member.username }}</VListItemTitle>
          <VListItemSubtitle
            >{{ member.first_name }} {{ member.last_name }}</VListItemSubtitle
          >
        </VListItemContent>
        <VListItemAction>
          <VBtn
            v-if="member.is_friend"
            depressed
            color="accent"
            class="mr-2"
            :loading="requestQueue.includes(member.guid)"
            :disabled="requestQueue.includes(member.guid)"
            @click="declineRequest(member.guid)"
            >Unfriend</VBtn
          >
          <VBtn
            v-else-if="!member.is_friend && !member.request_exists"
            depressed
            color="primary"
            class="mr-2"
            :loading="requestQueue.includes(member.guid)"
            :disabled="requestQueue.includes(member.guid)"
            @click="addOrAcceptRequest(member.guid, 'add')"
            >Add Friend</VBtn
          >
          <div
            v-else-if="
              !member.is_friend &&
              member.request_exists &&
              member.added_by_guid === member.guid
            "
          >
            <VBtn
              depressed
              color="primary"
              class="mr-2"
              :loading="requestQueue.includes(member.guid)"
              :disabled="requestQueue.includes(member.guid)"
              @click="addOrAcceptRequest(member.guid, 'accept')"
              >Confirm</VBtn
            >
            <VBtn depressed color="accent" class="mr-2">Delete</VBtn>
          </div>
          <VBtn
            v-else-if="
              !member.is_friend &&
              member.request_exists &&
              member.added_by_guid !== member.guid
            "
            depressed
            color="accent"
            class="mr-2"
            :loading="requestQueue.includes(member.guid)"
            :disabled="requestQueue.includes(member.guid)"
            @click="declineRequest(member.guid)"
            >Request Sent</VBtn
          >
        </VListItemAction>
      </VListItem>
    </VList>
    <AppInfiniteScroll v-if="latestMembers.length" @infinite="infiniteHandler">
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
import {
  useLatestMemberList,
  useSnackbar,
  useCreateFriendRequest,
  useRemoveFriend,
} from '~/composables';
import AppInfiniteScroll from '~/components/AppInfiniteScroll.vue';
import type { InfiniteHandler } from '~/types';

export default defineComponent({
  components: { AppInfiniteScroll },
  layout: 'authenticated',
  setup() {
    const {
      data: latestMembers,
      isError,
      isLoading,
      isFetching,
      refetch,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useLatestMemberList();
    const friendRequest = useCreateFriendRequest();
    const removeFriend = useRemoveFriend();
    const requestQueue = ref<string[]>([]);
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
      requestQueue.value.push(userId);
      try {
        await removeFriend.mutateAsync(userId);
        showSnackbar('Friend request removed');
      } catch (e) {
        showSnackbar('An error occurred');
      }
      const idx = requestQueue.value.indexOf(userId);
      requestQueue.value.splice(idx, 1);
    };

    const addOrAcceptRequest = async (
      userId: string,
      action: 'accept' | 'add'
    ) => {
      requestQueue.value.push(userId);
      try {
        await friendRequest.mutateAsync({
          userId,
          action,
        });
        showSnackbar('Friend request accepted');
      } catch (e) {
        showSnackbar('An error occurred');
      }
      const idx = requestQueue.value.indexOf(userId);
      requestQueue.value.splice(idx, 1);
    };

    return {
      latestMembers,
      isLoading,
      isError,
      isFetching,
      refetch,
      infiniteHandler,
      addOrAcceptRequest,
      declineRequest,
      requestQueue,
    };
  },
});
</script>
