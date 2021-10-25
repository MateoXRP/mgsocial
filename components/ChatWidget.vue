<template>
  <VCard height="80vh" class="d-flex">
    <VNavigationDrawer
      permanent
      :mini-variant="$vuetify.breakpoint.mdAndDown"
      :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'"
    >
      <VList>
        <VListItem>
          <VListItemContent>
            <VListItemTitle class="text-h6">
              Inbox({{ messagesCount ? messagesCount : 0 }})
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
      </VList>
      <ChatWidgetThreadList :threads="threads" :is-loading="isThreadsLoading" />
    </VNavigationDrawer>
    <VContainer
      v-if="$route.name === 'messages-username'"
      class="pa-0 d-flex flex-column"
    >
      <ChatWidgetHeader :selected-thread="selectedThread" />
      <div
        v-if="isMessagesLoading"
        class="d-flex justify-center align-center fill-height"
      >
        <VProgressCircular
          class="my-2"
          indeterminate
          color="primary"
        ></VProgressCircular>
      </div>
      <div v-else v-chat-scroll class="overflow-y-auto">
        <AppInfiniteScroll @infinite="handleMessageInfinite">
          <template #placeholder>
            <div class="my-2 text-center">
              <VProgressCircular
                indeterminate
                color="primary"
              ></VProgressCircular>
            </div>
          </template>
        </AppInfiniteScroll>
        <ChatWidgetMessageList :messages="messages" />
      </div>
      <ChatWidgetFooter :selected-thread="selectedThread" />
    </VContainer>
    <VContainer
      v-else
      class="title d-flex align-center justify-center fill-height"
    >
      You don’t have a message selected
    </VContainer>
  </VCard>
</template>

<script lang="ts">
import ChatWidgetThreadList from './ChatWidgetThreadList.vue';
import ChatWidgetHeader from './ChatWidgetHeader.vue';
import ChatWidgetFooter from './ChatWidgetFooter.vue';
import ChatWidgetMessageList from './ChatWidgetMessageList.vue';
import AppInfiniteScroll from './AppInfiniteScroll.vue';
import {
  useThreadList,
  useCurrentUser,
  useMessageList,
  Thread,
  useNotificationsCount,
} from '~/composables';
import { InfiniteHandler } from '~/types';

export default defineComponent({
  name: 'ChatWidget',
  components: {
    AppInfiniteScroll,
    ChatWidgetMessageList,
    ChatWidgetThreadList,
    ChatWidgetHeader,
    ChatWidgetFooter,
  },
  layout: 'authenticated',
  setup() {
    const currentUser = useCurrentUser();
    const route = useRoute();
    const selectedThread = ref<Thread>();
    const threadExists = ref(false);
    const selectedThreadUserId = computed(() =>
      selectedThread.value ? selectedThread.value.message_from.guid : null
    );
    const { messagesCount } = useNotificationsCount();

    const {
      data: threads,
      isLoading: isThreadsLoading,
      hasNextPage: threadsHasNextPage,
      isFetchingNextPage: isFetchingNextThreadsPage,
      fetchNextPage: fetchNextThreadsPage,
    } = useThreadList();

    // Set roomId on initial load only.
    watchEffect(() => {
      if (!isThreadsLoading.value && route.value.params.username) {
        const thread = threads.value.find(
          (i) => i.message_from.username === route.value.params.username
        );
        if (thread) {
          threadExists.value = true;
          selectedThread.value = thread;
        } else {
          // TODO: Get thread instead
          threadExists.value = false;
        }
      }
    });

    const {
      data: messages,
      isLoading: isMessagesLoading,
      hasNextPage: messagesHasNextPage,
      isFetchingNextPage: isFetchingNextMessagesPage,
      fetchNextPage: fetchNextMessagesPage,
    } = useMessageList(selectedThreadUserId);

    const handleThreadInfinite = async ($state: InfiniteHandler) => {
      if (threadsHasNextPage?.value && !isFetchingNextThreadsPage.value) {
        await fetchNextThreadsPage.value();
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    const handleMessageInfinite = async ($state: InfiniteHandler) => {
      if (messagesHasNextPage?.value && !isFetchingNextMessagesPage.value) {
        await fetchNextMessagesPage.value();
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    return {
      messages,
      currentUser,
      isMessagesLoading,
      handleThreadInfinite,
      handleMessageInfinite,
      threads,
      isThreadsLoading,
      threadsHasNextPage,
      selectedThread,
      messagesCount,
    };
  },
});
</script>
