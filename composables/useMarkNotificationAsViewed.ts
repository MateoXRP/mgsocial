import { useMutation, useQueryClient } from 'vue-query';
import { notificationCountKey, notificationListKey } from '.';
import type { OSSNWebServiceResponse } from '~/types';

export const useMarkNotificationAsViewed = () => {
  const queryClient = useQueryClient();
  const { $axios } = useContext();

  return useMutation(
    (notificationId: string) =>
      $axios.$post<OSSNWebServiceResponse>('/api/notifications_mark_viewed', {
        notification_guid: notificationId,
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(notificationListKey);
        queryClient.invalidateQueries(notificationCountKey);
      },
    }
  );
};
