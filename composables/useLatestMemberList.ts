import { useInfiniteQuery } from 'vue-query';
import { Merge } from 'type-fest';

import { User, useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

type ModifiedUser = Merge<
  User,
  {
    is_friend: boolean;
    request_exists: boolean;
    added_by_guid: string | null;
  }
>;

export type LatestMembersResponse = ExtendPayload<{
  users: ModifiedUser[];
  total: string;
  offset: number;
}>;

export const latestMemberListKey = ['latest_members'];

export const useLatestMemberList = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const queryInfo = useInfiniteQuery<LatestMembersResponse>(
    latestMemberListKey,
    () =>
      $axios.$post(`/api/latest_members`, {
        guid: currentUserId.value,
      })
  );

  const data = computed(() => {
    return queryInfo.data.value
      ? ([] as ModifiedUser[]).concat(
          ...queryInfo.data.value.pages.map((group) => {
            return group.payload.users || [];
          })
        )
      : [];
  });

  return {
    ...queryInfo,
    data,
  };
};
