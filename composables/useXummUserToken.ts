import { useMutation } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  user_token: string;
}

/**
 * Get xumm user token of current user.
 */
export const useXummUserToken = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();
  return useMutation(() =>
    $axios.$post<ExtendPayload<Payload | false>>('/api/user_xumm_token', {
      guid: currentUserId.value,
    })
  );
};
