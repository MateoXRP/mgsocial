<template>
  <VNavigationDrawer v-model="drawer" app clipped right>
    <VList v-if="isLoading">
      <VSkeletonLoader
        v-for="n in 10"
        :key="n"
        type="listItemAvatar"
      ></VSkeletonLoader>
    </VList>
    <FetchErrorAction
      v-else-if="isError"
      :is-loading="isFetching"
      refetch="refetch"
    />
    <VList v-else-if="onlineUsers && onlineUsers.list">
      <VListItem
        v-for="user in onlineUsers.list"
        :key="user.guid"
        :to="`/messages/${user.username}`"
      >
        <VListItemAvatar>
          <VBadge
            bordered
            bottom
            dot
            offset-x="10"
            offset-y="10"
            color="success"
          >
            <vAvatar size="36">
              <VImg :src="user.icon.small"></VImg>
            </vAvatar>
          </VBadge>
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle v-text="user.username"></VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script lang="ts">
import FetchErrorAction from './FetchErrorAction.vue';
import { useOnlineUserList } from '~/composables';

export default defineComponent({
  name: 'RightNavigationDrawer',
  components: { FetchErrorAction },
  setup() {
    const drawer = ref(null);
    const {
      data: onlineUsers,
      isLoading,
      isFetching,
      isError,
      refetch,
    } = useOnlineUserList();

    return {
      drawer,
      onlineUsers,
      isLoading,
      isFetching,
      isError,
      refetch,
    };
  },
});
</script>

<style>
.v-skeleton-loader__list-item-avatar {
  background: inherit !important;
}
</style>
