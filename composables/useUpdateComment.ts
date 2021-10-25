import { useMutation, useQueryClient } from 'vue-query';
import type { InfiniteData } from 'vue-query/types';
import {
  commentKeys,
  CommentListResponse,
  CommentRecord,
} from './useCommentList';
import { postKeys } from './usePostList';
import { useCurrentUserId, User } from '.';
import type { ExtendPayload } from '~/types';

interface Payload {
  comment: CommentRecord;
  user: User;
}

interface Body {
  id: string;
  comment: string;
  subjectId: string;
  type: string;
  postId: string;
}

export const useUpdateComment = () => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { $axios } = useContext();

  return useMutation(
    ({ id, comment }: Body) =>
      $axios.$post<ExtendPayload<Payload>>('/api/comment_edit', {
        id,
        comment,
        uguid: currentUserId.value,
      }),
    {
      async onSuccess(data, variables) {
        const queryKey = commentKeys.list(variables.subjectId);
        await queryClient.cancelQueries(queryKey);

        const previousData =
          queryClient.getQueryData<InfiniteData<CommentListResponse>>(queryKey);

        if (previousData) {
          const newPagesArray = previousData?.pages.map((item) => {
            if (!item.payload) return item;

            const comments = [...item.payload.comments];
            const commentIndex = comments.findIndex(
              (i) => i.id === variables.id
            );

            if (commentIndex !== -1) {
              const comment =
                variables.type === 'post' ? 'comments:post' : 'comments:entity';
              comments[commentIndex][comment] = data.payload.comment[comment];
            }

            return {
              ...item,
              payload: {
                ...item.payload,
                comments,
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
        queryClient.invalidateQueries(postKeys.detail(variables.postId));
      },
    }
  );
};
