import { useQuery } from 'vue-query';

import { useCurrentUserId } from './useCurrentUser';
import type { Album } from '.';
import type { ExtendPayload } from '~/types';

export interface AlbumPhotoRecord {
  image_url: string;
  guid: string;
}

interface Payload {
  album: Album;
  list: AlbumPhotoRecord[] | null | false;
}

export const albumPhotoKeys = {
  all: ['photos'] as const,
  lists: () => [...albumPhotoKeys.all, 'list'] as const,
  list: (albumId: string) => [...albumPhotoKeys.lists(), albumId] as const,
};

export const useAlbumPhotoList = (albumId: string) => {
  const currentUserId = useCurrentUserId();
  const { $axios } = useContext();

  return useQuery<ExtendPayload<Payload>>(
    albumPhotoKeys.list(albumId),
    () =>
      $axios.$post('/api/photos_list', {
        guid: currentUserId.value,
        album_guid: albumId,
      }),
    {
      enabled: !!albumId,
    }
  );
};
