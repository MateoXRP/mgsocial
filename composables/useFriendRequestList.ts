import { useInfiniteQuery } from 'vue-query';

import { useCurrentUserId } from './useCurrentUser';
import type { User } from './useUserDetail';
import type { ExtendPayload } from '~/types';

export type FriendRequestsResponse = ExtendPayload<{
  requests: User[] | null;
  count: number;
  offset: string | false;
}>;

export const friendRequestListKey = ['friend_requests'];

export const useFriendRequestList = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const queryInfo = useInfiniteQuery<FriendRequestsResponse>(
    friendRequestListKey,
    ({ pageParam = 1 }) =>
      $axios.$post(`/api/user_friend_requests`, {
        guid: currentUserId.value,
        offset: pageParam,
      })
  );

  const data = computed(() =>
    queryInfo.data.value
      ? ([] as User[]).concat(
          ...queryInfo.data.value.pages.map((group) => {
            return group.payload.requests || [];
          })
        )
      : []
  );

  return {
    ...queryInfo,
    data,
  };
};
