import { useQuery } from 'vue-query';
import type { Ref } from '@nuxtjs/composition-api';
import { useDebounce } from '@vueuse/core';
import type { User } from '.';
import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  count: number;
  results: User[];
}

interface Options {
  debounce?: number;
}

export const useFriendSearch = (
  query: Ref<string>,
  { debounce = 300 }: Options = {}
) => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();
  const debounced = useDebounce(query, debounce);
  const options = reactive({
    queryKey: ['friend_search', { debounced }],
    queryFn: () =>
      $axios.$post('/api/user_search_friend', {
        guid: currentUserId.value,
        search: debounced.value,
      }),
    enabled: computed(() => Boolean(debounced.value)),
    select: (data: ExtendPayload<Payload>) => {
      return data && data.code === '100' ? data.payload.results : [];
    },
  });
  return useQuery<ExtendPayload<Payload>, Error, Payload['results']>(options);
};
