import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  coil_earnings: string;
  coil_earnings_asset_code: string;
  xumm_tips: number;
  xumm_tips_new:
    | false
    | {
        [key: string]: number;
      };
}

export const useUserEarnings = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useQuery<ExtendPayload<Payload>>(['user_earnings'], () =>
    $axios.$post(`/api/user_earnings`, {
      guid: currentUserId.value,
    })
  );
};
