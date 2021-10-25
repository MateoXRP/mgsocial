import { useMutation, useQueryClient } from 'vue-query';

import { PostRecord, postKeys, useCurrentUserId } from '.';
import { ExtendPayload } from '~/types';

interface Body {
  guid: string;
  post: string;
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const { $axios } = useContext();

  return useMutation(
    (body: Body) =>
      $axios.$post<ExtendPayload<PostRecord>>('/api/wall_edit', {
        owner_guid: currentUserId.value,
        poster_guid: currentUserId.value,
        ...body,
      }),
    {
      // TODO: Mutate post ahead
      onSettled: () => {
        queryClient.invalidateQueries(postKeys.detail(currentUserId?.value!));
        queryClient.invalidateQueries(postKeys.lists());
      },
    }
  );
};
