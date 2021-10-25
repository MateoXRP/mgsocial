<template>
  <div class="fill-height d-flex flex-column align-center justify-center">
    <div class="text-body-2 font-weight-light">An error occurred.</div>
    <VBtn
      :loading="isLoading"
      color="primary"
      depressed
      class="mt-3"
      @click="refetch"
    >
      <VIcon left>mdi-reload</VIcon> Retry
    </VBtn>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'FetchErrorAction',
  props: {
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    // refetch: {
    //   type: Function,
    //   required: true
    // }
  },
  setup(_props, { emit }) {
    const refetch = () => {
      emit('refetch');
    };

    return {
      refetch,
    };
  },
});
</script>
