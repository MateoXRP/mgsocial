import { useQuery } from 'vue-query';
import type { Ref } from '@nuxtjs/composition-api';
import { ExtendPayload } from '~/types';

interface Payload {
  is_friend: boolean;
  request_exists: boolean;
  added_by_guid: string;
}

export const userIsFriendKey = ({
  currentUser,
  otherUser,
}: {
  currentUser: Ref<string | undefined>;
  otherUser: Ref<string | undefined>;
}) => ['user_is_friend', { currentUser, otherUser }];

export const useUserIsFriend = ({
  currentUser,
  otherUser,
}: {
  currentUser: Ref<string | undefined>;
  otherUser: Ref<string | undefined>;
}) => {
  const { $axios } = useContext();

  const options = reactive({
    queryKey: userIsFriendKey({ currentUser, otherUser }),
    queryFn: () =>
      $axios.$post<ExtendPayload<Payload>>('/api/user_is_friend', {
        user_a: currentUser.value,
        user_b: otherUser.value,
      }),
    enabled: computed(() => Boolean(currentUser.value && otherUser.value)),
  });

  return useQuery(options);
};
