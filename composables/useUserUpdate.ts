import { useMutation, useQueryClient } from 'vue-query';
import {
  useCurrentUserId,
  User,
  userDetailKey,
  userFriendsAndPostCountKey,
} from '.';
import type { ExtendPayload } from '~/types';

export type UpdateUserBody = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  payment_pointer: string;
  xumm_address: string;
};

export const useUserUpdate = () => {
  const currentUserId = useCurrentUserId();
  const {
    $axios,
    app: { $accessor },
  } = useContext();
  const queryClient = useQueryClient();

  return useMutation(
    (body: UpdateUserBody) =>
      $axios.$post<ExtendPayload<User>>(`/api/user_edit`, {
        guid: currentUserId.value,
        ...body,
      }),
    {
      onSuccess: (data) => {
        $accessor.auth.setUser({
          ...$accessor.auth.user,
          ...data.payload,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(userDetailKey(currentUserId.value!));
        queryClient.invalidateQueries(userFriendsAndPostCountKey);
      },
    }
  );
};
