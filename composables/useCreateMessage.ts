import dayjs from 'dayjs';
import { useMutation, useQueryClient } from 'vue-query';
import type { InfiniteData } from 'vue-query/types';

import {
  messageKeys,
  MessageListItem,
  MessageListResponse,
  MessageViewed,
  useCurrentUser,
  threadListKey,
} from '.';
import type { ExtendPayload } from '~/types';

interface CreateMessageBody {
  to: string;
  message: string;
  recipientFullName: string;
  recipientUsername: string;
  recipientIcon: string;
}

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const { $axios } = useContext();

  return useMutation(
    (body: CreateMessageBody) =>
      $axios.$post<ExtendPayload<MessageListItem>>(`/api/message_add`, {
        from: currentUser.value?.guid,
        to: body.to,
        message: body.message,
      }),
    {
      onMutate: async (variables) => {
        const queryKey = messageKeys.list({
          userId: ref(currentUser.value?.guid),
          to: ref(variables.to),
        });

        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(queryKey);

        // Snapshot the previous value
        const previousData =
          queryClient.getQueryData<InfiniteData<MessageListResponse>>(queryKey);

        // Optimistically update to the new value
        if (previousData) {
          const newPagesArray = previousData?.pages.map((page, index) => {
            // Add to first page
            if (index === 0 && page.payload) {
              const newMessage = {
                data: {},
                id: Date.now().toString(),
                message_from: {
                  guid: currentUser.value?.guid!,
                  fullname: currentUser.value?.fullname!,
                  username: currentUser.value?.username!,
                  icon: {
                    small: currentUser.value?.icon.small!,
                  },
                },
                message_to: {
                  guid: variables.to,
                  fullname: variables.recipientFullName,
                  username: variables.recipientUsername,
                  icon: {
                    small: variables.recipientUsername,
                  },
                },
                message: variables.message,
                viewed: MessageViewed.No,
                time: dayjs().unix().toString(),
                sent: false,
              };

              const list =
                page.payload && page.payload.list
                  ? [...page.payload.list, newMessage]
                  : [newMessage];

              return {
                ...page,
                payload: {
                  ...page.payload,
                  list,
                },
              };
            }

            return page;
          });

          queryClient.setQueryData<InfiniteData<MessageListResponse>>(
            queryKey,
            {
              ...previousData,
              pages: newPagesArray,
            }
          );
        }

        return {
          previousData,
        };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_error, variables, context: any) => {
        if (context?.previousData) {
          queryClient.setQueryData<InfiniteData<MessageListResponse>>(
            messageKeys.list({
              userId: ref(currentUser.value?.guid),
              to: ref(variables.to),
            }),
            context.previousData
          );
        }
      },
      // Always refetch after error or success:
      onSettled: (_data, _error, variables, _context) => {
        queryClient.invalidateQueries(
          messageKeys.list({
            userId: ref(currentUser.value?.guid),
            to: ref(variables.to),
          })
        );
        queryClient.invalidateQueries(threadListKey);
      },
    }
  );
};
