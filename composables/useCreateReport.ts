import { useMutation } from 'vue-query';

import { useCurrentUserId } from './useCurrentUser';
import type { ExtendPayload } from '~/types';

interface Body {
  uguid?: string;
  guid: string;
  reason: string;
}

export const useCreateReport = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();
  return useMutation(({ guid, reason }: Body) =>
    $axios.$post<ExtendPayload<boolean>>('/api/report_add', {
      uguid: currentUserId.value,
      guid,
      reason,
    })
  );
};
