import { useMutation } from 'vue-query';

interface Response {
  result?: {
    next: {
      always: string;
      no_push_msg_received: string;
    };
  };
  success: boolean;
}

export const usePublicSquarePosting = () => {
  const { $axios } = useContext();

  return useMutation((text: string) =>
    $axios.$post<Response>(`/api2/xumm/public-square`, {
      text,
    })
  );
};
