import { useQueryClient, useMutation } from 'vue-query';
import type { FileWithPath } from 'file-selector';
import { Post, postKeys, PostPrivacy } from './usePostList';
import { userFriendsAndPostCountKey } from './useUserFriendsAndPostCount';
import type { ExtendPayload } from '~/types';

export enum Monetized {
  Yes = '1',
  No = '0',
}

export enum PostType {
  User = 'user',
  Group = 'group',
}

export interface CreatePostBody {
  owner_guid: string | number;
  poster_guid: string | number;
  post: string;
  friends?: string;
  location?: string;
  privacy: PostPrivacy;
  type: PostType;
  is_monetized: Monetized;
  item_type?: string;
  item_guid?: string;
  ossn_photo?: FileWithPath;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { $axios } = useContext();

  return useMutation(
    (body: CreatePostBody) => {
      const formData = new FormData();
      Object.keys(body).forEach((key) => {
        // @ts-ignore
        formData.append(key, body[key]);
      });
      return $axios.$post<ExtendPayload<{ post: Post }>>(
        `/api/wall_add`,
        formData
      );
    },
    {
      onSettled: (_data, _error, variables, _context) => {
        queryClient.invalidateQueries(postKeys.list(variables.privacy));
        queryClient.invalidateQueries(userFriendsAndPostCountKey);
        // TODO: Add user post list
      },
    }
  );
};
