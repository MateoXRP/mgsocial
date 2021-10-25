import type { Ref } from '@nuxtjs/composition-api';
import { useQuery } from 'vue-query';
import { Merge } from 'type-fest';

import { Reaction, useCurrentUser, User } from '.';
import { ExtendPayload } from '~/types';

export type ReactionListItem = Merge<Reaction, { user: User }>;

interface Payload {
  reactions: ReactionListItem[];
}

export const reactionListKey = (type: string, id: string) => [
  'reaction_list',
  { type, id },
];

export const useReactionList = ({
  type,
  id,
  enabled,
}: {
  type: 'post' | 'annotation';
  id: string;
  enabled: Ref<boolean>;
}) => {
  const currentUserId = useCurrentUser();
  const { $axios } = useContext();

  const options = reactive({
    queryKey: reactionListKey(type, id),
    queryFn: () =>
      $axios.$post('/api/reaction_list', {
        uguid: currentUserId.value,
        guid: id,
        type,
      }),
    enabled,
  });

  const queryInfo = useQuery<ExtendPayload<Payload>>(options);

  const data = computed(() => {
    const value = queryInfo.data.value;
    if (!value) return [];
    if (!value.payload.reactions[0]) return [];
    return value.payload.reactions;
  });

  return {
    ...queryInfo,
    data,
  };
};
