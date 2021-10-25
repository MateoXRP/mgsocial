import type { ComputedRef, Ref } from '@nuxtjs/composition-api';
import { useInfiniteQuery } from 'vue-query';
import { useCurrentUserId } from '.';
import linkify from '~/utils/linkify-string';

import type { ExtendPayload } from '~/types';
import decodeHTMLEntities from '~/utils/decode-html-entities';

interface User {
  guid: string;
  fullname: string;
  username: string;
  icon: {
    small: string;
  };
}

export enum MessageViewed {
  Yes = '1',
  No = '0',
}

export interface MessageListItem {
  data: object;
  id: string;
  message_from: User;
  message_to: User;
  message: string;
  viewed: MessageViewed;
  time: string;
  sent?: boolean;
}

interface Payload {
  list: MessageListItem[] | false;
  withuser: User;
  count: number;
  offset: number;
}

export type MessageListResponse = ExtendPayload<Payload | false>;

// https://tkdodo.eu/blog/effective-react-query-keys
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (filter: {
    userId: Ref<string | undefined> | string | undefined;
    to: Ref<string | null> | string | null;
  }) => [...messageKeys.lists(), filter] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: number) => [...messageKeys.details(), id] as const,
};

export function useMessageList(to: ComputedRef<string | null>) {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const options = reactive({
    queryKey: messageKeys.list({ userId: currentUserId, to }),
    queryFn: ({ pageParam = 1 }) =>
      $axios.$post(`/api/message_list`, {
        guid: currentUserId.value,
        to: to.value,
        offset: pageParam,
        markallread: 1,
      }),
    enabled: computed(() => Boolean(currentUserId.value && to)),
  });

  const queryInfo = useInfiniteQuery<MessageListResponse>(options);

  const data = computed(() =>
    queryInfo.data.value
      ? ([] as MessageListItem[])
          .concat(
            ...queryInfo.data.value.pages.map((group) => {
              return group.payload && group.payload.list
                ? group.payload.list
                : [];
            })
          )
          .map((item) => ({
            ...item,
            message:
              currentUserId.value === item.message_from.guid
                ? linkify(
                    decodeHTMLEntities(
                      item.message.replace(/<br ?\/?>/g, '\n')
                    ),
                    'white--text text-decoration-underline'
                  )
                : decodeHTMLEntities(item.message.replace(/<br ?\/?>/g, '\n')),
          }))
          .sort((a, b) => parseFloat(a.time) - parseFloat(b.time))
      : []
  );

  return {
    ...queryInfo,
    data,
  };
}
