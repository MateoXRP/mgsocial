<template>
  <AppFragment>
    <VCard>
      <VCardTitle>
        Notifications
        <VSpacer />
        <VBtn
          text
          color="primary"
          class="hidden-sm-and-down"
          @click="markAllAsRead"
          >Mark all as read</VBtn
        >
        <VBtn icon class="hidden-md-and-up" @click="markAllAsRead">
          <VIcon>mdi-eye-check-outline</VIcon>
        </VBtn>
      </VCardTitle>
      <VList v-if="isLoading" two-line>
        <VSkeletonLoader
          v-for="n in 5"
          :key="n"
          v-bind="$attrs"
          type="list-item-avatar-two-line"
          :width="$vuetify.breakpoint.mdAndUp ? '50%' : '80%'"
        ></VSkeletonLoader>
      </VList>
      <div v-else-if="isError" class="pb-4">
        <FetchErrorAction :is-loading="isFetching" @refetch="refetch" />
      </div>
      <VList v-else two-line>
        <VListItem
          v-for="item in notifications"
          :key="item.notification.guid"
          @click="openNotification(item)"
        >
          <VListItemAvatar>
            <VImg :src="item.poster.icon"></VImg>
          </VListItemAvatar>
          <VListItemContent>
            <VListItemTitle
              >{{ item.poster.fullname }}
              {{
                notificationMessageMap[item.notification.type]
              }}</VListItemTitle
            >
            <VListItemSubtitle
              :class="[
                item.notification.viewed === null ? 'primary--text' : 'inherit',
              ]"
              >{{
                $dateUtils.timeAgo(item.notification.time_created)
              }}</VListItemSubtitle
            >
          </VListItemContent>
          <VListItemAction v-if="item.notification.viewed === null">
            <VIcon color="primary" small>mdi-circle</VIcon>
          </VListItemAction>
        </VListItem>
      </VList>
      <AppInfiniteScroll v-if="notifications.length" @infinite="handleInfinite">
        <template #placeholder>
          <VSkeletonLoader
            v-for="n in 5"
            :key="n"
            v-bind="$attrs"
            type="list-item-avatar-two-line"
          ></VSkeletonLoader>
        </template>
      </AppInfiniteScroll>
    </VCard>
  </AppFragment>
</template>

<script lang="ts">
import { NotificationRecord, useNotificationList } from '~/composables';
import { useMarkAllNotificationAsViewed } from '~/composables/useMarkAllNotificationAsViewed';
import { notificationMessageMap } from '~/utils/constants';
import FetchErrorAction from '~/components/FetchErrorAction.vue';
import AppInfiniteScroll from '~/components/AppInfiniteScroll.vue';
import { InfiniteHandler } from '~/types';
import { useMarkNotificationAsViewed } from '~/composables/useMarkNotificationAsViewed';

export default defineComponent({
  components: { AppInfiniteScroll, FetchErrorAction },
  layout: 'authenticated',
  setup() {
    const {
      isLoading,
      data: notifications,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      isError,
      refetch,
      isFetching,
    } = useNotificationList();
    const markAllNotification = useMarkAllNotificationAsViewed();
    const markNotification = useMarkNotificationAsViewed();
    const router = useRouter();

    const openNotification = (notif: NotificationRecord) => {
      if (typeof notif.notification.viewed !== 'string') {
        markNotification.mutate(notif.notification.guid);
      }

      if (
        ['like:annotation', 'comments:post'].includes(notif.notification.type)
      ) {
        router.push({ path: `/post/view/${notif.notification.subject_guid}` });
      } else if (
        [
          'like:entity:file:profile:cover',
          'like:entity:file:profile:photo',
        ].includes(notif.notification.type)
      ) {
        // TODO: Image error
        // setSelectedPhotoUri(item.notification.item_guid);
      } else {
        router.push({ path: `/post/view/${notif.notification.item_guid}` });
      }
    };

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
      isFetching,
      refetch,
      notifications,
      openNotification,
      markAllAsRead: markAllNotification.mutate,
      notificationMessageMap,
      handleInfinite,
    };
  },
  head() {
    return {
      title: 'Notifications',
    };
  },
});
</script>
