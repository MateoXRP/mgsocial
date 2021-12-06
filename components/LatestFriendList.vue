<template>
  <VCard elevation="1">
    <VCardTitle v-text="title" />
    <VDivider />
    <VList v-if="isLoading">
      <VSkeletonLoader
        v-for="n in 5"
        :key="n"
        type="list-item"
      ></VSkeletonLoader>
    </VList>
    <div v-else-if="isError" class="pa-4">
      <FetchErrorAction :is-loading="isFetching" @refetch="refetch" />
    </div>
    <VList v-else>
      <VListItem
        v-for="user in getFiveFriends"
        :key="user.guid"
        :to="`/u/${user.username}`"
      >
        <VListItemAvatar>
          <v-img :src="user.icon.small"></v-img>
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>
            {{ $decodeHTMLEntities(user.username) }}</VListItemTitle
          >
        </VListItemContent>
      </VListItem>
    </VList>
    <VCardActions v-if="!isError && !isLoading && currentUser">
      <VBtn
        block
        text
        color="primary"
        nuxt
        :to="`/u/${currentUser.username}/friends`"
        >See all</VBtn
      >
    </VCardActions>
  </VCard>
</template>

<script lang="ts">
import { useCurrentUser, useFriendList } from '~/composables';

export default defineComponent({
  name: 'LatestFriendList',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Latest Friends',
    },
  },
  setup() {
    const currentUser = useCurrentUser();
    const { isLoading, isError, data, isFetching, refetch } = useFriendList(
      currentUser.value?.username!
    );

    const getFiveFriends = computed(() => {
      if (data.value) {
        return data.value.slice(0, 5);
      }

      return data.value;
    });

    return {
      isLoading,
      isError,
      isFetching,
      refetch,
      getFiveFriends,
      currentUser,
    };
  },
});
</script>
