import { useMutation, useQueryClient } from 'vue-query';
import type { FileWithPath } from 'file-selector';
import type { InfiniteData } from 'vue-query/types';
import {
  useCurrentUserId,
  postKeys,
  commentKeys,
  CommentRecord,
  CommentListResponse,
} from '.';
import type { User } from '.';
import type { ExtendPayload } from '~/types';

export type CreateCommentBody = {
  subject_guid: string;
  comment: string;
  type: 'entity' | 'post';
  postId: string | null;
  image_file?: FileWithPath;
};

interface Payload {
  comment: CommentRecord;
  user: User;
}

export const useCreateComment = () => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { $axios } = useContext();

  return useMutation(
    (body: CreateCommentBody) => {
      const formData = new FormData();
      Object.keys(body).forEach((key) => {
        if (key === 'postId') return;
        // @ts-ignore
        formData.append(key, body[key]);
      });
      formData.append('uguid', currentUserId.value!);
      return $axios.$post<ExtendPayload<Payload>>(`/api/comment_add`, formData);
    },
    {
      onSuccess: async (data, variables) => {
        const queryKey = commentKeys.list(variables.subject_guid);

        await queryClient.cancelQueries(queryKey);

        const previousData =
          queryClient.getQueryData<InfiniteData<CommentListResponse>>(queryKey);

        if (previousData) {
          const newPagesArray = [...previousData.pages];
          const lastItem = newPagesArray[newPagesArray.length - 1];
          if (lastItem.payload) {
            lastItem.payload.comments.push({
              ...data.payload.comment,
              user: data.payload.user,
              reactions: [],
            });
          }

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
        queryClient.invalidateQueries(commentKeys.list(variables.subject_guid));
        queryClient.invalidateQueries(postKeys.detail(variables.postId!));
      },
    }
  );
};
