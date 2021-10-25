<template>
  <div class="chat-footer pa-2 d-flex align-center">
    <VTextarea
      v-model="message"
      placeholder="Type your message"
      rounded
      filled
      dense
      hide-details
      rows="1"
      no-resize
      @keydown.enter.prevent="sendMessage"
    >
      <template slot="prepend">
        <AppEmojiPicker
          v-slot="{ activator }"
          top
          @handleClick="message += $event"
        >
          <VIcon v-bind="activator.attrs" v-on="activator.on"
            >mdi-emoticon-outline</VIcon
          >
        </AppEmojiPicker>
      </template>
      <template slot="append-outer">
        <VIcon @click="sendMessage">mdi-send</VIcon>
      </template>
    </VTextarea>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';

import AppEmojiPicker from './AppEmojiPicker.vue';
import { Thread, useCreateMessage } from '~/composables';

export default defineComponent({
  name: 'ChatWidgetFooter',
  components: { AppEmojiPicker },
  props: {
    selectedThread: {
      type: Object as PropType<Thread>,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const message = ref('');
    const mutate = useCreateMessage();

    const sendMessage = () => {
      if (!message.value || !props.selectedThread) return;
      emit('messageSent');
      const { message_from: messageFrom } = props.selectedThread;
      try {
        mutate.mutate({
          to: messageFrom.guid,
          message: message.value,
          recipientFullName: messageFrom.fullname,
          recipientUsername: messageFrom.username,
          recipientIcon: messageFrom.icon.small,
        });
        message.value = '';
      } catch (e) {}
    };

    return {
      message,
      sendMessage,
    };
  },
});
</script>

<style>
.chat-footer {
  height: var(--var-footer-height);
}
</style>
