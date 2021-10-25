import type { ComputedRef } from '@nuxtjs/composition-api';
import { useInfiniteQuery, useQueryClient } from 'vue-query';
import { useCurrentUserId } from './useCurrentUser';
import type { User } from './useUserDetail';
import type { ExtendPayload } from '~/types';

export enum PostItemType {
  ProfilePhoto = 'profile:photo',
  Share = 'post:share:post',
  CoverPhoto = 'cover:photo',
}

export interface Post {
  data: Record<any, any>;
  guid: string;
  time_created: string;
  owner_guid: string;
  description: string;
  title: string;
  type: string;
  subtype: string;
  item_type?: PostItemType;
  item_guid?: string;
  poster_guid: string;
  access: string;
  time_updated: string;
  'file:wallphoto'?: string;
  sentiment: string;
  linkPreview: string;
  profile_photo_url?: string;
  profile_cover_url?: string;
  total_likes: number;
  is_liked_by_user: boolean;
  total_comments: number;
}

export type Reaction = {
  id: string;
  subject_guid: string;
  guid: string;
  type: 'post' | 'annotation';
  subtype: string;
};

export interface PostRecord {
  post: Post;
  friends: User[] | null;
  reactions: Reaction[];
  text: string;
  location: string;
  user: User;
  image: string;
  original?: PostRecord;
  xumm_tips: number;
  xumm_tips_new: {
    currency: string;
    amount: number | string;
  }[];
}

interface Payload {
  posts: PostRecord[];
  count: string;
  offset: string;
}

export type PostListResponse = ExtendPayload<Payload>;

export enum PostPrivacy {
  Public = '2',
  Friends = '3',
}

// https://tkdodo.eu/blog/effective-react-query-keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (access: PostPrivacy, tag?: string) =>
    [...postKeys.lists(), { access, tag }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (postId: string) => [...postKeys.details(), postId] as const,
  user: (userId: ComputedRef<string | null> | string) =>
    [...postKeys.lists(), { userId }] as const,
};

export const usePostList = (tag?: string) => {
  const { $axios, app } = useContext();
  const privacy = computed(() => app.$accessor.newsFeedFilter);
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();

  const options = reactive({
    queryKey: postKeys.list(privacy.value, tag),
    queryFn: ({ pageParam = 1 }) => {
      const body: Record<any, any> = {
        guid: currentUserId.value,
        offset: pageParam,
        access: privacy.value,
      };
      if (tag) {
        body.tag = tag;
      }
      return $axios.$post('/api/wall_list_home', body);
    },
  });

  const queryInfo = useInfiniteQuery<PostListResponse>(options);

  // TODO: Fix posts not updated when privacy is changed
  watch(privacy, () => {
    queryClient.resetQueries(postKeys.list(PostPrivacy.Public, tag), {
      exact: true,
    });
    queryClient.resetQueries(postKeys.list(PostPrivacy.Friends, tag), {
      exact: true,
    });
  });

  const data = computed(() =>
    queryInfo.data.value
      ? ([] as PostRecord[]).concat(
          ...queryInfo.data.value.pages.map((page) => {
            return page.payload.posts || [];
          })
        )
      : []
  );

  return {
    ...queryInfo,
    data,
  };
};
