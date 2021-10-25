import type { Ref } from '@nuxtjs/composition-api';
import { useQuery } from 'vue-query';
import type { Trustline } from 'xrpl/dist/npm/models/methods/accountLines';

/**
 * Get user's xrpl tokens.
 * @param address Xumm address of user to tip to.
 * @param isDialogOpen Visibility status of Tip dialog.
 */
export const useTrustLine = (address: string, isDialogOpen: Ref<boolean>) => {
  const { $axios } = useContext();
  const options = reactive({
    queryKey: ['trust-line', { address }],
    queryFn: () =>
      $axios.$get('/api2/ripple/get-trust-lines?address=' + address),
    enabled: computed(() => Boolean(isDialogOpen.value && address)),
    refetchOnWindowFocus: false,
  });
  return useQuery<Trustline[]>(options);
};
