import { useInfiniteQuery } from 'vue-query';

import { useCurrentUser } from './useCurrentUser';
import type { ExtendPayload } from '~/types';

interface NotificationItem {
  guid: string;
  type: string;
  poster_guid: string;
  owner_guid: string;
  subject_guid: string;
  viewed?: any;
  time_created: string;
  item_guid: string;
}

interface Poster {
  guid: string;
  fullname: string;
  icon: string;
}

interface Entity {
  guid: string;
  time_created: string;
  time_updated: string;
  permission: string;
  active: string;
  owner_guid: string;
  value: string;
  type: string;
  subtype: string;
}

export interface NotificationRecord {
  notification: NotificationItem;
  poster: Poster;
  entity: false | Entity;
  post: boolean;
}

interface Payload {
  list: NotificationRecord[] | false;
  count: string | false;
  offset: number;
}

export const notificationListKey = ['notifications'];

export const useNotificationList = () => {
  const { $axios } = useContext();
  const user = useCurrentUser();

  const queryInfo = useInfiniteQuery<ExtendPayload<Payload>>(
    notificationListKey,
    ({ pageParam = 1 }) =>
      $axios.$post(`/api/notifications_list_user`, {
        owner_guid: user.value?.guid,
        offset: pageParam,
      })
  );

  const data = computed(() =>
    queryInfo.data.value
      ? ([] as NotificationRecord[]).concat(
          ...queryInfo.data.value.pages.map((page) => {
            return page.payload.list || [];
          })
        )
      : []
  );

  return {
    ...queryInfo,
    data,
  };
};
