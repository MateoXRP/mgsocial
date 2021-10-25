import { useMutation, useQueryClient } from 'vue-query';

import {
  friendKeys,
  friendRequestListKey,
  latestMemberListKey,
  useCurrentUser,
} from '.';
import { ExtendPayload } from '~/types';

interface Payload {
  is_friend: boolean;
  request_exists: boolean;
  success: boolean;
}

export const useRemoveFriend = () => {
  const { $axios } = useContext();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation(
    (friendId: string) =>
      $axios.$post<ExtendPayload<Payload>>('/api/user_remove_friend', {
        user_a: currentUser.value?.guid,
        user_b: friendId,
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(friendRequestListKey);
        queryClient.invalidateQueries(latestMemberListKey);
        queryClient.invalidateQueries(
          friendKeys.list(currentUser.value?.username!)
        );
      },
    }
  );
};
