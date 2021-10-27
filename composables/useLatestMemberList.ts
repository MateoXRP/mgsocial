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
    ({ pageParam = 1 }) =>
      $axios.$post(`/api/latest_members`, {
        guid: currentUserId.value,
        offset: pageParam,
      }),
    {
      getNextPageParam: (lastGroup: Record<any, any>) => {
        if (lastGroup.payload && lastGroup.payload.total) {
          const { total, offset } = lastGroup.payload;
          // Get number of pages based on total posts
          const totalPages = Math.ceil(Number(total) / 10);

          // If current page (offset) is equal to
          // totalPages, stop infinite query.
          if (Number(offset) === totalPages) return false;

          // Set next page
          return +offset + 1;
        }

        return false;
      },
    }
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
