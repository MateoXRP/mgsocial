import { useQuery } from 'vue-query';

import { PostRecord, postKeys, useCurrentUserId } from '.';
import type { ExtendPayload } from '~/types';

export const usePostDetail = (postId: string) => {
  const { $axios, error } = useContext();
  const currentUserId = useCurrentUserId();
  return useQuery<ExtendPayload<PostRecord>, Error, PostRecord>(
    postKeys.detail(postId),
    () =>
      $axios
        .post('/api/wall_view', {
          guid: currentUserId.value,
          post_guid: postId,
        })
        .then((res) => {
          if (!res.data.payload) {
            error({ statusCode: 404, message: 'err message' });
            return;
          }

          return res.data;
        }),
    {
      select: (data) => data.payload,
      retry: 0,
    }
  );
};
