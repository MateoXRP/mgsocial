import { useMutation } from 'vue-query';

import { useCurrentUserId } from '.';

interface Body {
  destination: string;
  receiverId: string;
  postId: string;
  currency: string;
  issuer?: string;
  amount: string;
  userToken?: string;
}

interface Response {
  result?: {
    next: {
      always: string;
      no_push_msg_received: string;
    };
  };
  success: boolean;
}

/**
 * Create new xumm payload.
 */
export const useCreateXummPayload = () => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  return useMutation(
    (body: Body) =>
      $axios.$post<Response>('/api2/xumm/payment', {
        senderId: currentUserId.value,
        ...body,
      }),
    {
      onSettled: () => {},
    }
  );
};
