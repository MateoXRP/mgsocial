import { useInfiniteQuery } from 'vue-query';
import type { Ref } from '@nuxtjs/composition-api';

interface Author {
  _id: string;
  account: string;
  gravatarURL: string;
  __v: number;
  username: string;
}

interface Amount {
  currency: string;
  _id: string;
  value: string;
}

interface Data {
  content: string;
  comments: any[];
  likes: any[];
  tips: any[];
  _id: string;
  author: Author;
  userAccount: string;
  amount: Amount;
  date: string;
  hash: string;
  __v: number;
}

interface Root {
  data: Data[];
  nextCursor: number;
}

export const publicSquarePostListKey = {
  all: ['public_square_posts'] as const,
  lists: () => [...publicSquarePostListKey.all, 'list'] as const,
  list: (xummAddress: string) =>
    [...publicSquarePostListKey.lists(), xummAddress] as const,
};

export const usePublicSquarePostList = (xummAddress: Ref<string>) => {
  const { $axios } = useContext();

  const options = reactive({
    queryKey: publicSquarePostListKey.list(xummAddress.value),
    queryFn: ({ pageParam = 0 }) =>
      $axios.$get(
        `/api2/public-square/posts?xummAddress=${xummAddress.value}&cursor=${pageParam}`
      ),
    getNextPageParam: (lastGroup: Root) => {
      return lastGroup.nextCursor ? lastGroup.nextCursor : false;
    },
    enabled: computed(() => Boolean(xummAddress.value)),
  });

  const queryInfo = useInfiniteQuery<Root>(options);

  const data = computed(() =>
    queryInfo.data.value
      ? ([] as Data[]).concat(
          ...queryInfo.data.value.pages.map((page) =>
            Array.isArray(page.data) ? page.data : []
          )
        )
      : []
  );

  return {
    ...queryInfo,
    data,
  };
};
