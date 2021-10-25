import { useMutation, useQueryClient } from 'vue-query';
import type { FileWithPath } from 'file-selector';
import { postKeys, useCurrentUserId, User, userDetailKey } from '.';
import type { ExtendPayload } from '~/types';

export interface UpdateProfilePhotoBody {
  userphoto: FileWithPath;
}

interface Payload {
  guid: number;
  user: User;
}

/**
 * Update profile or cover photo.
 * @param type whether a profile or cover photo.
 * @param username username of current user.
 */
export const useUpdateProfilePhoto = ({
  type,
  username,
}: {
  type: 'profile' | 'cover';
  username: string;
}) => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { $axios } = useContext();

  const apiUrl =
    type === 'profile' ? '/api/photos_profile_add' : '/api/photos_cover_add';

  return useMutation(
    (body: UpdateProfilePhotoBody) => {
      const formData = new FormData();
      Object.keys(body).forEach((key) => {
        // @ts-ignore
        formData.append(key, body[key]);
      });
      formData.append('guid', currentUserId.value!);
      return $axios.$post<ExtendPayload<Payload>>(apiUrl, formData);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(userDetailKey(username));
        if (type === 'profile') {
          queryClient.invalidateQueries(postKeys.user(currentUserId.value!));
        }
      },
    }
  );
};
