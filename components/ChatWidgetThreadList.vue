<template>
  <VList two-line>
    <template v-if="isLoading">
      <VSkeletonLoader
        v-for="n in 5"
        :key="n"
        type="list-item-avatar"
      ></VSkeletonLoader>
    </template>
    <VListItem
      v-for="thread in threads"
      :key="thread.id"
      class="px-2"
      nuxt
      :to="`/messages/${thread.message_from.username}`"
      exact
    >
      <VListItemAvatar>
        <VImg :src="thread.message_from.icon.small"></VImg>
      </VListItemAvatar>
      <VListItemContent>
        <VListItemTitle v-text="thread.message_from.username"></VListItemTitle>
        <VListItemSubtitle>{{
          decodeHTMLEntities(thread.message)
        }}</VListItemSubtitle>
      </VListItemContent>
    </VListItem>
  </VList>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import type { Thread } from '~/composables';
import decodeHTMLEntities from '~/utils/decode-html-entities';

export default defineComponent({
  name: 'ChatWidgetThreadList',
  props: {
    isLoading: {
      required: true,
      type: Boolean,
      default: true,
    },
    threads: {
      required: true,
      type: Array as PropType<Thread[]>,
      default: () => [],
    },
  },
  setup() {
    return { decodeHTMLEntities };
  },
});
</script>

<style>
.chat-thread-list {
  height: calc(var(--var-chat-height) - var(--var-header-height));
}
</style>
