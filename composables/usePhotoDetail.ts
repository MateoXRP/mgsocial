import { useQuery } from 'vue-query';

import { profileOrCoverAlbumPhotoKeys, useCurrentUserId, User } from '.';
import type { ExtendPayload } from '~/types';

interface Photo {
  guid: string;
  is_liked_by_user: boolean;
  total_likes: number;
  image_url: string;
  time_created: string;
}

interface Payload {
  user: User;
  photo: Photo;
}

export const usePhotoDetail = (photoId: string) => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useQuery<ExtendPayload<Payload>>(
    profileOrCoverAlbumPhotoKeys.detail(photoId),
    () =>
      $axios.$post('/api/photos_view_profile', {
        uguid: currentUserId.value,
        photo_guid: photoId,
      }),
    {
      enabled: !!photoId,
    }
  );
};
