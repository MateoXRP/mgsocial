import { useQuery } from 'vue-query';
import { useCurrentUser } from '.';

/**
 * Get user's total MGS rewards.
 */
export const useTotalRewards = () => {
  const { $axios } = useContext();
  const currentUser = useCurrentUser();
  const options = reactive({
    queryKey: ['total-rewards', { address: currentUser.value?.xummaddress }],
    queryFn: () =>
      $axios.$get(
        '/api2/ripple/get-total-rewards?address=' +
          currentUser.value?.xummaddress
      ),
    enabled: computed(() =>
      Boolean(currentUser.value && currentUser.value.xummaddress)
    ),
  });
  return useQuery<{ amount: number }>(options);
};
