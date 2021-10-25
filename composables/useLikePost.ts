import { useMutation, useQueryClient } from 'vue-query';
import type { InfiniteData } from 'vue-query/types';
import { postKeys, PostListResponse, useCurrentUserId } from '.';
import { OSSNWebServiceResponse } from '~/types';
import { generateRandomId } from '~/utils/generate-random-id';

export enum ReactionType {
  Like = 'like',
  Love = 'love',
  Haha = 'haha',
  Wow = 'wow',
  Yay = 'yay',
  Sad = 'sad',
  Angry = 'angry',
}

interface Body {
  postId: string;
  type: 'entity' | 'post';
  action: 'unlike' | 'like';
  reaction_type?: ReactionType;
  userId: string;
}

export const useLikePost = () => {
  const {
    $axios,
    app: { $accessor },
  } = useContext();
  const route = useRoute();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const privacy = computed(() => $accessor.newsFeedFilter);

  const hashtag =
    route.value.name === 'hashtag-hashtag'
      ? route.value.params.hashtag
      : undefined;
  const postListQueryKey = postKeys.list(privacy.value, hashtag);

  return useMutation(
    (body: Body) =>
      $axios.$post<OSSNWebServiceResponse>(
        body.action === 'like' ? '/api/like_add' : '/api/unlike_set',
        {
          subject_guid: body.postId,
          uguid: currentUserId.value,
          type: body.type,
          reaction_type: body.reaction_type,
        }
      ),
    {
      onMutate: (variables) => {
        // Previous post list data
        const previousPostListData =
          queryClient.getQueryData<InfiniteData<PostListResponse>>(
            postListQueryKey
          );

        // Previous user post list data
        const previousUserPostListData = queryClient.getQueryData<
          InfiniteData<PostListResponse>
        >(postKeys.user(variables.userId));

        // Previous post detail data
        const previousPostDetailData = queryClient.getQueryData(
          postKeys.detail(variables.postId)
        );

        if (previousPostListData) {
          const newPagesArray = previousPostListData?.pages.map((item) => {
            const posts = [...item.payload.posts];
            const postIndex = posts.findIndex((i) => {
              const guid = i.post.item_type ? i?.post?.item_guid : i.post.guid;
              return guid === variables.postId;
            });

            if (postIndex !== -1) {
              if (variables.action === 'like') {
                posts[postIndex].post.total_likes =
                  Number(posts[postIndex].post.total_likes) + 1;
                posts[postIndex].post.is_liked_by_user = true;

                posts[postIndex].reactions.push({
                  id: generateRandomId(20),
                  subject_guid: variables.postId,
                  guid: currentUserId.value!,
                  type: 'post',
                  subtype: variables.reaction_type!,
                });
              } else {
                posts[postIndex].post.total_likes =
                  Number(posts[postIndex].post.total_likes) - 1;
                posts[postIndex].post.is_liked_by_user = false;

                const reactionIndex = posts[postIndex].reactions.findIndex(
                  (i) => i.guid === currentUserId.value
                );
                posts[postIndex].reactions.splice(reactionIndex, 1);
              }
            }

            return {
              ...item,
              payload: {
                ...item.payload,
                posts,
              },
            };
          });

          queryClient.setQueryData<InfiniteData<PostListResponse>>(
            postListQueryKey,
            {
              ...previousPostListData,
              pages: newPagesArray,
            }
          );
        }

        if (previousUserPostListData) {
          const newPagesArray = previousUserPostListData?.pages.map((item) => {
            const posts = [...item.payload.posts];
            const postIndex = posts.findIndex((i) => {
              const guid = i.post.item_type ? i?.post?.item_guid : i.post.guid;
              return guid === variables.postId;
            });

            if (postIndex !== -1) {
              if (variables.action === 'like') {
                posts[postIndex].post.total_likes =
                  Number(posts[postIndex].post.total_likes) + 1;
                posts[postIndex].post.is_liked_by_user = true;

                posts[postIndex].reactions.push({
                  id: generateRandomId(20),
                  subject_guid: variables.postId,
                  guid: currentUserId.value!,
                  type: 'post',
                  subtype: variables.reaction_type!,
                });
              } else {
                posts[postIndex].post.total_likes =
                  Number(posts[postIndex].post.total_likes) - 1;
                posts[postIndex].post.is_liked_by_user = false;

                const reactionIndex = posts[postIndex].reactions.findIndex(
                  (i) => i.guid === currentUserId.value
                );
                posts[postIndex].reactions.splice(reactionIndex, 1);
              }
            }

            return {
              ...item,
              payload: {
                ...item.payload,
                posts,
              },
            };
          });

          queryClient.setQueryData<InfiniteData<PostListResponse>>(
            postKeys.user(variables.userId),
            {
              ...previousUserPostListData,
              pages: newPagesArray,
            }
          );
        }

        return {
          previousPostListData,
          previousUserPostListData,
          previousPostDetailData,
        };
      },
      onError: (_error, variables, context: any) => {
        // Revert previous post list data
        if (context?.previousPostListData) {
          queryClient.setQueryData<InfiniteData<PostListResponse>>(
            postListQueryKey,
            context.previousPostsData
          );
        }

        // Revert previous user post list data
        if (context?.previousPostListData) {
          queryClient.setQueryData<InfiniteData<PostListResponse>>(
            postKeys.user(variables.userId),
            context.previousPostListData
          );
        }

        // Revert previous post detail data
        if (context?.previousPostDetailData) {
          queryClient.setQueryData(
            postKeys.detail(variables.postId),
            context.previousPostDetailData
          );
        }
      },
      onSettled: (_data, _error, _variables, _context) => {
        // queryClient.invalidateQueries(postKeys.detail(variables.postId));
        // queryClient.invalidateQueries(postListQueryKey);
        // queryClient.invalidateQueries(postKeys.user(variables.userId));
      },
    }
  );
};
