<template>
  <ChatWidget />
</template>

<script lang="ts">
import ChatWidget from '~/components/ChatWidget.vue';

export default defineComponent({
  components: {
    ChatWidget,
  },
  layout: 'authenticated',
});
</script>
