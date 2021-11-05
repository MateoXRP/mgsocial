import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

export const userDetailKey = (email: string) => ['user_details', email];

export interface User {
  guid: string;
  type: 'admin' | 'normal';
  first_name: string;
  last_name: string;
  fullname: string;
  username: string;
  email: string;
  birthdate: string;
  gender: string;
  icon: {
    topbar: string;
    smaller: string;
    small: string;
    larger: string;
    large: string;
  };
  cover_url: string;
  language: string;
  xummaddress: string;
  paymentpointer: string;
}

export type UserDetailResponse = ExtendPayload<User>;

export const useUserDetail = (username: string) => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const options = reactive({
    queryKey: userDetailKey(username),
    queryFn: () =>
      $axios.$post('/api/user_details', {
        username,
      }),
    enabled: computed(() => Boolean(currentUserId.value && username)),
    select: (data: UserDetailResponse) => data.payload,
  });

  return useQuery<UserDetailResponse, Error, User>(options);
};
