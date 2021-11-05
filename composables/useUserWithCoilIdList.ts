import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface User {
  coil_id: string;
  date_coil_id_added: string;
  guid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const useUserWithCoilIdList = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useQuery<ExtendPayload<User[]>>(['users_with_coil_id'], () =>
    $axios.$post(`/api/users_with_coil_id`, {
      guid: currentUserId.value,
    })
  );
};
