<template>
  <VCard class="mt-2" elevation="1">
    <VCardTitle> Latest Members </VCardTitle>
    <VDivider></VDivider>
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
        v-for="user in latestMembers"
        :key="user.guid"
        :to="`/u/${user.username}`"
      >
        <VListItemAvatar>
          <v-img :src="user.icon.small"></v-img>
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle v-text="user.username"></VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
    <VCardActions v-if="!isError && !isLoading">
      <VBtn block text color="primary" nuxt to="/latest-members">See all</VBtn>
    </VCardActions>
  </VCard>
</template>

<script lang="ts">
import FetchErrorAction from './FetchErrorAction.vue';
import { useLatestMemberList } from '~/composables';

export default defineComponent({
  name: 'LatestMemberList',
  components: { FetchErrorAction },
  setup() {
    const { isLoading, isError, data, refetch, isFetching } =
      useLatestMemberList();

    const latestMembers = computed(() => data.value.slice(0, 5));

    return {
      isLoading,
      latestMembers,
      isError,
      refetch,
      isFetching,
    };
  },
});
</script>
