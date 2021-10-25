import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  notifications: string;
  messages: string;
  friends: number;
}

const getCount = (data: any, key: string) => {
  if (
    !data ||
    (data && data.code !== '100') ||
    (data && data.code === '100' && data.payload[key] === '0')
  ) {
    return false;
  }

  return data.payload[key];
};

export const notificationCountKey = ['notifications_count'];

export const useNotificationsCount = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const queryInfo = useQuery<ExtendPayload<Payload>>(
    notificationCountKey,
    () =>
      $axios.$post(`/api/notifications_count`, {
        guid: currentUserId?.value,
      }),
    {
      refetchInterval: 60000,
    }
  );

  const notificationsCount = computed(() =>
    getCount(queryInfo.data.value, 'notifications')
  );
  const messagesCount = computed(() =>
    getCount(queryInfo.data.value, 'messages')
  );
  const friendsCount = computed(() =>
    getCount(queryInfo.data.value, 'friends')
  );

  return {
    notificationsCount,
    messagesCount,
    friendsCount,
  };
};
