import { useInfiniteQuery } from 'vue-query';

import { NuxtAxiosInstance } from '@nuxtjs/axios';
import type { User } from '.';
import type { ExtendPayload } from '~/types';

export type FriendListResponse = ExtendPayload<{
  friends: User[] | null;
  total: string;
  offset: number;
}>;

// https://tkdodo.eu/blog/effective-react-query-keys
export const friendKeys = {
  all: ['friends'] as const,
  lists: () => [...friendKeys.all, 'list'] as const,
  list: (username: string) => [...friendKeys.lists(), username] as const,
  details: () => [...friendKeys.all, 'detail'] as const,
  detail: (id: number) => [...friendKeys.details(), id] as const,
};

export const fetchFriendList = ({
  $axios,
  username,
  offset = 1,
}: {
  $axios: NuxtAxiosInstance;
  username: string;
  offset: number;
}) => {
  return $axios.$post(`/api/user_friends`, {
    username,
    offset,
  });
};

export const useFriendList = (username: string) => {
  const { $axios } = useContext();

  const queryInfo = useInfiniteQuery<FriendListResponse>(
    friendKeys.list(username),
    ({ pageParam = 1 }) =>
      fetchFriendList({
        $axios,
        username,
        offset: pageParam,
      }),
    {
      enabled: !!username,
    }
  );

  const data = computed(() =>
    queryInfo.data.value
      ? ([] as User[]).concat(
          ...queryInfo.data.value.pages.map((group) => {
            return group.payload.friends || [];
          })
        )
      : []
  );

  return {
    ...queryInfo,
    data,
  };
};
