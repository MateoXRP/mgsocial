import { useMutation, useQueryClient } from 'vue-query';

import { useCurrentUserId } from './useCurrentUser';
import { notificationCountKey } from './useNotificationsCount';
import { notificationListKey } from './useNotificationList';
import type { OSSNWebServiceResponse } from '~/types';

export const useMarkAllNotificationAsViewed = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      $axios.$post<OSSNWebServiceResponse>(
        '/api/notifications_mark_all_viewed',
        {
          guid: currentUserId.value,
        }
      ),
    {
      onSettled: () => {
        queryClient.invalidateQueries(notificationListKey);
        queryClient.invalidateQueries(notificationCountKey);
      },
    }
  );
};
