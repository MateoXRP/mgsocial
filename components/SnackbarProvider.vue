<template>
  <AppFragment>
    <slot />
    <VSnackbar v-model="show" :timeout="options.timeout" bottom left>
      {{ text }}
      <template v-if="options.showCloseButton" #action="{ attrs }">
        <VBtn
          :color="options.closeButtonColor"
          text
          v-bind="attrs"
          @click="show = false"
        >
          Close
        </VBtn>
      </template>
    </VSnackbar>
  </AppFragment>
</template>

<script lang="ts">
import { toRefs } from '@nuxtjs/composition-api';
import { CreateSnackbarKey, CreateSnackbarOptions } from '~/composables';

export default defineComponent({
  name: 'SnackbarProvider',
  setup() {
    const state = reactive({
      show: false,
      text: '',
      options: {
        showCloseButton: true,
        closeButtonColor: '',
        timeout: 3000,
      } as CreateSnackbarOptions,
    });

    const createSnackbar = (
      text: string,
      options: CreateSnackbarOptions = {}
    ) => {
      state.show = true;
      state.text = text;
      state.options = {
        ...state.options,
        ...options,
      };
    };

    provide(CreateSnackbarKey, createSnackbar);

    return {
      ...toRefs(state),
    };
  },
});
</script>
