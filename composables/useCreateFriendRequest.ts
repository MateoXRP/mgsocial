import { useMutation, useQueryClient } from 'vue-query';

import {
  friendKeys,
  friendRequestListKey,
  latestMemberListKey,
  notificationCountKey,
  useCurrentUserId,
} from '.';
// import { userIsFriendKey } from './useUserIsFriend';
import type { ExtendPayload } from '~/types';

interface Payload {
  is_friend: boolean;
  request_exists: boolean;
}

export const useCreateFriendRequest = () => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { $axios } = useContext();

  return useMutation(
    ({ userId }: { userId: string; action: 'accept' | 'add' }) =>
      $axios.$post<ExtendPayload<Payload>>('/api/user_add_friend', {
        user_a: currentUserId.value,
        user_b: userId,
      }),
    {
      onSettled: (_data, _error, _variables, _context) => {
        queryClient.invalidateQueries(friendKeys.list(currentUserId.value!));
        queryClient.invalidateQueries(friendRequestListKey);
        queryClient.invalidateQueries(notificationCountKey);
        queryClient.invalidateQueries(latestMemberListKey);
        // queryClient.invalidateQueries(
        //   userIsFriendKey(user?.guid!, variables.userId)
        // );
      },
    }
  );
};
