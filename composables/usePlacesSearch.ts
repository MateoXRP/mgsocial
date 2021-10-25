import type { Ref } from '@nuxtjs/composition-api';
import { useDebounce } from '@vueuse/core';
import { useQuery } from 'vue-query';

interface Place {
  id: string;
  text: string;
  placeName: string;
}

interface Response {
  success: boolean;
  places: Place[];
}

interface Options {
  debounce?: number;
}

export const usePlacesSearch = (
  query: Ref<string>,
  { debounce = 300 }: Options = {}
) => {
  const { $axios } = useContext();
  const debounced = useDebounce(query, debounce);
  const options = reactive({
    queryKey: ['places_autocomplete', { debounced }],
    queryFn: () => $axios.$get('/api2/places-search?q=' + debounced.value),
    enabled: computed(() => Boolean(debounced.value)),
  });
  return useQuery<Response>(options);
};
