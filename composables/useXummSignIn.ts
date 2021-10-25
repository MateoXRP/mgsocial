import { useMutation } from 'vue-query';
import { useCurrentUserId } from '.';

export const useXummSignIn = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useMutation(() =>
    $axios.$post(`/api2/xumm/signin`, {
      userId: currentUserId.value,
    })
  );
};
