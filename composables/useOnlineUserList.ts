import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { User } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  list: User[] | false;
  total: number;
}

type OnlineUserListResponse = ExtendPayload<Payload>;

export const onlineUserListKey = ['online_users'];

const ONE_MINUTE = 60000;

export const useOnlineUserList = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useQuery<OnlineUserListResponse, Error, Payload>(
    onlineUserListKey,
    () =>
      $axios.$post(`/api/online_users`, {
        guid: currentUserId.value,
      }),
    {
      refetchInterval: ONE_MINUTE,
      select: (data) => {
        return {
          total: data.payload.total,
          list: data.payload.list
            ? data.payload.list.filter((i) => i.guid !== currentUserId.value)
            : [],
        };
      },
    }
  );
};
