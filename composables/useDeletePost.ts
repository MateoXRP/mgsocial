import { useMutation, useQueryClient } from 'vue-query';

import type { InfiniteData } from 'vue-query/types';

import {
  PostListResponse,
  postKeys,
  userFriendsAndPostCountKey,
  useCurrentUserId,
} from '.';
import type { OSSNWebServiceResponse } from '~/types';

export const useDeletePost = () => {
  const currentUserId = useCurrentUserId();
  const { $axios, app } = useContext();
  const privacy = computed(() => app.$accessor.newsFeedFilter);

  const queryClient = useQueryClient();
  return useMutation(
    (postId: string) =>
      $axios.$post<OSSNWebServiceResponse>('/api/wall_delete', {
        post_guid: postId,
        guid: currentUserId.value,
      }),
    {
      onSuccess: async (_data, postId) => {
        await queryClient.cancelQueries(postKeys.list(privacy.value));

        const previousData = queryClient.getQueryData<
          InfiniteData<PostListResponse>
        >(postKeys.list(privacy.value));

        if (previousData) {
          const newPagesArray = previousData?.pages.map((item) => {
            return {
              ...item,
              payload: {
                ...item.payload,
                posts: item.payload.posts.filter(
                  (post) => post.post.guid !== postId
                ),
              },
            };
          });

          queryClient.setQueryData<InfiniteData<PostListResponse>>(
            postKeys.list(privacy.value),
            {
              ...previousData,
              pages: newPagesArray,
            }
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(postKeys.lists());
        queryClient.invalidateQueries(userFriendsAndPostCountKey);
      },
    }
  );
};
