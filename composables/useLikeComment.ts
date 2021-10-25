import { useMutation, useQueryClient } from 'vue-query';
import type { InfiniteData } from 'vue-query/types';
import {
  commentKeys,
  CommentListResponse,
  ReactionType,
  useCurrentUserId,
} from '.';
import type { OSSNWebServiceResponse } from '~/types';
import { generateRandomId } from '~/utils/generate-random-id';

interface Body {
  commentId: string;
  action: string;
  subjectId: string;
  reaction?: ReactionType;
}

export const useLikeComment = () => {
  const { $axios } = useContext();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();

  return useMutation(
    (body: Body) =>
      $axios.$post<OSSNWebServiceResponse>(
        body.action === 'like' ? '/api/like_add' : '/api/unlike_set',
        {
          subject_guid: body.commentId,
          uguid: currentUserId.value,
          type: 'annotation',
          reaction_type: body.reaction,
        }
      ),
    {
      onMutate: (variables) => {
        const previousData = queryClient.getQueryData<
          InfiniteData<CommentListResponse>
        >(commentKeys.list(variables.subjectId));

        if (previousData) {
          const newPagesArray = previousData?.pages.map((item) => {
            if (!item.payload) return item;

            const comments = [...item.payload.comments];
            const commentIndex = comments.findIndex(
              (i) => i.id === variables.commentId
            );

            if (commentIndex !== -1) {
              if (variables.action === 'like') {
                comments[commentIndex].total_likes =
                  Number(comments[commentIndex].total_likes) + 1;
                comments[commentIndex].is_liked_by_user = true;

                comments[commentIndex].reactions.push({
                  id: generateRandomId(10),
                  subject_guid: variables.commentId,
                  guid: currentUserId.value!,
                  type: 'annotation',
                  subtype: variables.reaction!,
                });
              } else {
                comments[commentIndex].total_likes =
                  Number(comments[commentIndex].total_likes) - 1;
                comments[commentIndex].is_liked_by_user = false;

                const reactionIndex = comments[
                  commentIndex
                ].reactions.findIndex((i) => i.guid === currentUserId.value);
                comments[commentIndex].reactions.splice(reactionIndex, 1);
              }
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
            commentKeys.list(variables.subjectId),
            {
              ...previousData,
              pages: newPagesArray,
            }
          );
        }

        return {
          previousData,
        };
      },
      onError: (_error, variables, context: any) => {
        if (context?.previousData) {
          queryClient.setQueryData<InfiniteData<CommentListResponse>>(
            commentKeys.list(variables.subjectId),
            context.previousData
          );
        }
      },
      onSettled: (_data, _error, _variables, _context) => {
        // queryClient.invalidateQueries(commentKeys.list(variables.subjectId));
      },
    }
  );
};
