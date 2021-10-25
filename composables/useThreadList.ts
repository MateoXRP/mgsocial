import { useInfiniteQuery } from 'vue-query';
import { useCurrentUserId } from '.';

import type { ExtendPayload } from '~/types';

export interface Thread {
  data: object;
  id: string;
  message_from: {
    guid: string;
    fullname: string;
    username: string;
    icon: {
      small: string;
    };
  };
  message_to: {
    guid: string;
    fullname: string;
    username: string;
    icon: {
      small: string;
    };
  };
  message: string;
  viewed: string;
  time: string;
  answered: number;
}

interface Payload {
  list: Thread[] | false;
  count: string | false;
  offset: number;
}

export const threadListKey = ['threads'];

export function useThreadList() {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const queryInfo = useInfiniteQuery<ExtendPayload<Payload>>(
    threadListKey,
    ({ pageParam = 1 }) =>
      $axios.$post(`/api/message_recent`, {
        guid: currentUserId.value,
        offset: pageParam,
      })
  );

  const data = computed(() =>
    queryInfo.data.value
      ? ([] as Thread[]).concat(
          ...queryInfo.data.value.pages.map((group) => {
            return group.payload.list || [];
          })
        )
      : []
  );

  return {
    ...queryInfo,
    data,
  };
}
