import { useInfiniteQuery } from 'vue-query';

import type { Reaction } from './usePostList';
import type { User } from './useUserDetail';
import { useCurrentUserId } from './useCurrentUser';
import type { ExtendPayload } from '~/types';

export interface CommentRecord {
  id: string;
  time_created: string;
  owner_guid: string;
  subject_guid: string;
  type: 'comments:post' | 'comments:entity';
  user: User;
  total_likes: number;
  is_liked_by_user: boolean;
  'file:comment:photo'?: string;
  'comments:post': string;
  'comments:entity': string;
  reactions: Reaction[];
}

interface Payload {
  comments: CommentRecord[];
  count: string;
  offset: string;
}

export type CommentListResponse = ExtendPayload<Payload | false>;

type StringOrUndefined = string | undefined;

export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (subjectGuid: StringOrUndefined) =>
    [...commentKeys.lists(), subjectGuid] as const,
};

export const useCommentList = (
  subjectGuid: StringOrUndefined,
  type: 'entity' | 'post'
) => {
  const currentUserId = useCurrentUserId();
  const { $axios } = useContext();

  const options = reactive({
    queryKey: commentKeys.list(subjectGuid),
    queryFn: ({ pageParam = 1 }) =>
      $axios.$post('/api/comments_list', {
        uguid: currentUserId.value,
        guid: subjectGuid,
        offset: pageParam,
        page_limit: 5,
        type,
      }),
    enabled: computed(() =>
      Boolean(currentUserId.value && type && subjectGuid)
    ),
  });

  const queryInfo = useInfiniteQuery<CommentListResponse>(options);

  const data = computed(() => {
    return queryInfo.data && queryInfo.data.value
      ? ([] as CommentRecord[]).concat(
          ...queryInfo.data.value.pages.map((page) => {
            return page.payload && page.payload.comments
              ? page.payload.comments
              : [];
          })
        )
      : [];
  });

  return {
    ...queryInfo,
    data,
  };
};
