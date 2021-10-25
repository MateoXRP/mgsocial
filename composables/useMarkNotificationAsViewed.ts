import { useMutation, useQueryClient } from 'vue-query';

import { notificationCountKey, notificationListKey } from '.';
import type { OSSNWebServiceResponse } from '~/types';

const markNotificationAsViewed = async (notificationId: string) => {
  const { $axios } = useContext();
  await $axios.$post<OSSNWebServiceResponse>('/api/notifications_mark_viewed', {
    notification_guid: notificationId,
  });
};

export const useMarkNotificationAsViewed = () => {
  const queryClient = useQueryClient();

  return useMutation(markNotificationAsViewed, {
    onSettled: () => {
      queryClient.invalidateQueries(notificationListKey);
      queryClient.invalidateQueries(notificationCountKey);
    },
  });
};
