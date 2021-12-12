import { useMutation, useQueryClient } from 'vue-query';

import {
  friendKeys,
  friendRequestListKey,
  useCurrentUserId,
  userIsBlockedKey,
} from '.';
import type { ExtendPayload } from '~/types';

export const useBlockUser = () => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { $axios } = useContext();

  return useMutation(
    ({
      otherUserId,
      action,
    }: {
      otherUserId: string;
      action: 'block' | 'unblock';
    }) =>
      $axios.$post<ExtendPayload<Boolean>>('/api/block_user', {
        user_a: currentUserId.value,
        user_b: otherUserId,
        type: action,
      }),
    {
      onSettled: (_data, _error, variables, _context) => {
        queryClient.invalidateQueries(friendKeys.list(currentUserId.value!));
        queryClient.invalidateQueries(friendRequestListKey);
        queryClient.invalidateQueries(
          userIsBlockedKey({
            currentUserId: currentUserId.value!,
            otherUserId: variables.otherUserId,
          })
        );
      },
      onSuccess: (data, variables) => {
        if (data.payload) {
          const previousData = queryClient.getQueryData<ExtendPayload<Boolean>>(
            userIsBlockedKey({
              currentUserId: currentUserId.value!,
              otherUserId: variables.otherUserId,
            })
          );

          queryClient.setQueryData(
            userIsBlockedKey({
              currentUserId: currentUserId.value!,
              otherUserId: variables.otherUserId,
            }),
            {
              ...previousData,
              payload: variables.action === 'block',
            }
          );
        }
      },
    }
  );
};
