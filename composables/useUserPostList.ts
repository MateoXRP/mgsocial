import type { ComputedRef } from '@nuxtjs/composition-api';
import { useInfiniteQuery } from 'vue-query';
import { useCurrentUserId, postKeys, PostListResponse, PostRecord } from '.';

export const useUserPostList = (userId: ComputedRef<string | null>) => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const options = reactive({
    queryKey: postKeys.user(userId),
    queryFn: ({ pageParam = 1 }) =>
      $axios.$post('/api/wall_list_user', {
        uguid: userId.value,
        offset: pageParam,
        guid: currentUserId.value,
      }),
    enabled: computed(() => Boolean(currentUserId.value && userId)),
  });
  const queryInfo = useInfiniteQuery<PostListResponse>(options);

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
