import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  posts: number;
  friends: number;
}

export const userFriendsAndPostCountKey = ['friends_and_posts_count'];

export const useUserFriendsAndPostCount = () => {
  const currentUserId = useCurrentUserId();
  const { $axios } = useContext();

  return useQuery<ExtendPayload<Payload>>(userFriendsAndPostCountKey, () =>
    $axios.$post('/api/friends_and_posts_count', {
      uguid: currentUserId.value,
    })
  );
};
