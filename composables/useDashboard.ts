import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  total_users: number;
  online_users: number;
  total_coil_earnings: number;
  total_xumm_tips: number;
  total_users_per_month: {
    year: string;
    month: string;
    YM: string;
    total: string;
  }[];
}

export const useDashboard = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useQuery<ExtendPayload<Payload>>(['dashboard'], () =>
    $axios.$post(`/api/dashboard`, {
      guid: currentUserId.value,
    })
  );
};
