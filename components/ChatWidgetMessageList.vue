<template>
  <div>
    <div
      v-for="m in messages"
      :key="m.id"
      :class="[
        'd-flex my-4 mx-2',
        m.message_from.guid === currentUserId ? 'justify-end' : null,
      ]"
    >
      <VSheet
        v-if="m.message_from.guid === currentUserId"
        rounded="lg"
        color="primary"
        dark
        class="body-2 py-2 px-4"
        style="max-width: 80%"
      >
        <div v-dompurify-html="m.message"></div>
        <div class="text-right chat-timestamp">
          {{ $dateUtils.timeAgo(m.time) }}
        </div>
      </VSheet>
      <VAvatar v-if="m.message_from.guid !== currentUserId" size="35">
        <VImg :src="m.message_from.icon.small"></VImg>
      </VAvatar>
      <VSheet
        v-if="m.message_from.guid !== currentUserId"
        rounded="lg"
        class="body-2 py-2 px-4 ml-3"
        style="max-width: 80%"
        :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
      >
        <div v-dompurify-html="m.message"></div>
        <div class="text-right chat-timestamp">
          {{ $dateUtils.timeAgo(m.time) }}
        </div>
      </VSheet>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import { MessageListItem, useCurrentUserId } from '~/composables';
import decodeHTMLEntities from '~/utils/decode-html-entities';

export default defineComponent({
  name: 'ChatWidgetMessageList',
  props: {
    messages: {
      required: true,
      type: Array as PropType<MessageListItem[]>,
      default: () => [],
    },
  },
  setup() {
    const currentUserId = useCurrentUserId();

    return {
      currentUserId,
      decodeHTMLEntities,
    };
  },
});
</script>

<style>
.chat-timestamp {
  font-size: 10px;
}
</style>
