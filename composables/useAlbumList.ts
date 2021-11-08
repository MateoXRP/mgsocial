import { useInfiniteQuery } from 'vue-query';

import { useCurrentUserId } from './useCurrentUser';
import type { ExtendPayload } from '~/types';

export interface Album {
  data: {};
  guid: string;
  time_created: string;
  owner_guid: string;
  description: string;
  title: string;
  type: string;
  subtype: string;
  access: string;
}

export interface AlbumRecord {
  image_url: string;
  album: Album;
}

interface Payload {
  albums: AlbumRecord[];
  profile_photo: string;
  cover_photo: string;
  count: string;
  offset: number;
}

export const albumKeys = {
  all: ['albums'] as const,
  lists: () => [...albumKeys.all, 'list'] as const,
  list: (username: string) => [...albumKeys.lists(), username] as const,
};

export const useAlbumList = (username: string) => {
  const currentUserId = useCurrentUserId();
  const { $axios } = useContext();

  const options = reactive({
    queryKey: albumKeys.list(username),
    queryFn: ({ pageParam = 1 }) =>
      $axios.$post('/api/photos_list_albums', {
        uguid: currentUserId.value,
        username,
        offset: pageParam,
        page_limit: 6,
      }),
    enabled: !!username,
  });

  return useInfiniteQuery<ExtendPayload<Payload>>(options);
};
