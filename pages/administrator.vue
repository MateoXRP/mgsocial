<template>
  <div>admin</div>
</template>

<script lang="ts">
import { useDashboard } from '~/composables';

export default defineComponent({
  layout: 'authenticated',
  middleware: ['auth', 'admin'],
  setup() {
    const { data, isLoading } = useDashboard();

    return {
      data,
      isLoading,
    };
  },
});
</script>
