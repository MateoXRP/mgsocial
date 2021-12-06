<template>
  <VToolbar
    class="elevation-1"
    :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'"
  >
    <VSkeletonLoader
      v-if="!selectedThread"
      type="list-item-avatar"
      width="100%"
    ></VSkeletonLoader>
    <VListItem v-else-if="selectedThread.message">
      <VListItemAvatar>
        <VImg :src="selectedThread.message_from.icon.small"></VImg>
      </VListItemAvatar>
      <VListItemContent>
        <VListItemTitle>
          {{ $decodeHTMLEntities(selectedThread.message_from.username) }}
        </VListItemTitle>
      </VListItemContent>
      <VListItemAction>
        <VBtn icon><VIcon>mdi-dots-vertical</VIcon></VBtn>
      </VListItemAction>
    </VListItem>
  </VToolbar>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import type { Thread } from '~/composables';

export default defineComponent({
  name: 'ChatWidgetHeader',
  props: {
    selectedThread: {
      type: Object as PropType<Thread>,
      default: () => ({}),
    },
  },
});
</script>
