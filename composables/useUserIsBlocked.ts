import { useQuery } from 'vue-query';
import type { Ref } from '@nuxtjs/composition-api';
import { useCurrentUserId } from '.';
import { ExtendPayload } from '~/types';

export const userIsBlockedKey = ({
  currentUserId,
  otherUserId,
}: {
  currentUserId: string;
  otherUserId: string;
}) => ['user_is_blocked', { currentUserId, otherUserId }];

export const useUserIsBlocked = ({
  isMenuOpen,
  otherUserId,
}: {
  isMenuOpen: Ref<boolean>;
  otherUserId: string;
}) => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const options = reactive({
    queryKey: userIsBlockedKey({
      currentUserId: currentUserId.value!,
      otherUserId,
    }),
    queryFn: () =>
      $axios.$post<ExtendPayload<Boolean>>('/api/user_is_blocked', {
        user_a: currentUserId.value,
        user_b: otherUserId,
      }),
    enabled: computed(() =>
      Boolean(isMenuOpen.value && currentUserId.value && otherUserId)
    ),
  });

  return useQuery(options);
};
