import { useQuery } from 'vue-query';

import type { ExtendPayload } from '~/types';

export interface ProfileOrCoverAlbumPhotoRecord {
  image_url: string;
  guid: string;
}

interface Payload {
  list: ProfileOrCoverAlbumPhotoRecord[];
}

export const profileOrCoverAlbumPhotoKeys = {
  all: ['photos'] as const,
  lists: () => [...profileOrCoverAlbumPhotoKeys.all, 'list'] as const,
  list: ({ username, type }: { username: string; type: 'profile' | 'cover' }) =>
    [
      ...profileOrCoverAlbumPhotoKeys.lists(),
      {
        username,
        type,
      },
    ] as const,
  details: () => [...profileOrCoverAlbumPhotoKeys.all, 'detail'] as const,
  detail: (photoId: string) =>
    [...profileOrCoverAlbumPhotoKeys.details(), photoId] as const,
};

export const useProfileOrCoverAlbumPhotoList = ({
  username,
  type,
}: {
  username: string;
  type: 'profile' | 'cover';
}) => {
  const { $axios } = useContext();

  return useQuery<ExtendPayload<Payload>>(
    profileOrCoverAlbumPhotoKeys.list({
      username,
      type,
    }),
    () =>
      $axios.$post('/api/photos_list_profile_cover', {
        // guid: currentUserId.value,
        username,
        type,
      }),
    {
      enabled: !!username && !!type,
    }
  );
};
