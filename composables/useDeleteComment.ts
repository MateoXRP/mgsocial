import { useMutation, useQueryClient } from 'vue-query';

import type { InfiniteData } from 'vue-query/types';
import {
  commentKeys,
  CommentListResponse,
  postKeys,
  useCurrentUserId,
} from '.';
import type { OSSNWebServiceResponse } from '~/types';

interface Body {
  commentId: string; // comment id
  subjectId: string; // Wall post guid or entity guid
  type: string; // post or entity
  postId: string | null; // Wall post id
}

export const useDeleteComment = () => {
  const currentUserId = useCurrentUserId();
  const { $axios } = useContext();
  const queryClient = useQueryClient();
  return useMutation(
    ({ commentId }: Body) =>
      $axios.$post<OSSNWebServiceResponse>('/api/comment_delete', {
        id: commentId,
        guid: currentUserId.value,
      }),
    {
      async onSuccess(_data, variables) {
        const queryKey = commentKeys.list(variables.subjectId);

        await queryClient.cancelQueries(queryKey);

        const previousData =
          queryClient.getQueryData<InfiniteData<CommentListResponse>>(queryKey);

        if (previousData) {
          const newPagesArray = previousData?.pages.map((item) => {
            if (!item.payload) return item;

            return {
              ...item,
              payload: {
                ...item.payload,
                comments: item.payload.comments.filter(
                  (comment) => comment.id !== variables.commentId
                ),
              },
            };
          });

          queryClient.setQueryData<InfiniteData<CommentListResponse>>(
            queryKey,
            {
              ...previousData,
              pages: newPagesArray,
            }
          );
        }
      },
      onSettled: (_data, _error, variables, _context) => {
        queryClient.invalidateQueries(commentKeys.list(variables.subjectId));
        queryClient.invalidateQueries(postKeys.detail(variables.postId!));
      },
    }
  );
};
