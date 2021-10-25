<template>
  <VAlert dense text prominent type="error" class="mt-4">
    <VRow align="center">
      <VCol class="grow"> An error occurred </VCol>
      <VCol class="shrink">
        <VBtn outlined @click="reload">Retry</VBtn>
      </VCol>
    </VRow>
  </VAlert>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'NewsFeedError',
  props: {
    errorMessage: {
      required: false,
      type: String,
      default: '',
    },
  },
  setup(_props, { emit }) {
    const reload = () => {
      emit('refetch');
    };

    return {
      reload,
    };
  },
});
</script>
