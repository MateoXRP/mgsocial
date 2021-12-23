import { useQuery } from 'vue-query';

import { useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

interface User {
  xumm_token: string;
  date_coil_token_added: string;
  guid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface FormattedUser {
  guid: string;
  username: string;
  email: string;
  tokens: {
    token: string;
    dateAdded: string;
  }[];
}

export const useUserWithXummTokenList = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useQuery<ExtendPayload<User[]>, Error, FormattedUser[]>(
    ['users_with_xumm_token'],
    () =>
      $axios.$post(`/api/users_with_xumm_id`, {
        guid: currentUserId.value,
      }),
    {
      select: (data) => {
        const users: FormattedUser[] = [];

        data.payload.forEach((user) => {
          const index = users.findIndex((i) => i.guid === user.guid);
          if (index !== -1) {
            users[index].tokens.push({
              token: user.xumm_token,
              dateAdded: user.date_coil_token_added,
            });
          } else {
            users.push({
              guid: user.guid,
              username: user.username,
              email: user.email,
              tokens: [
                {
                  token: user.xumm_token,
                  dateAdded: user.date_coil_token_added,
                },
              ],
            });
          }
        });

        return users;
      },
    }
  );
};
