<template>
  <AppFragment>
    <slot />
    <VDialog
      v-model="isOpen"
      :max-width="options.width"
      :persistent="options.persistent"
    >
      <VCard>
        <VCardTitle>{{ title }}</VCardTitle>
        <VCardText>{{ content }}</VCardText>
        <VCardActions class="pt-0">
          <VSpacer />
          <VBtn
            v-show="!!options.showCancel"
            color="primary"
            text
            @click="cancel"
            >Cancel</VBtn
          >
          <VBtn color="primary" text @click="agree">Yes</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </AppFragment>
</template>

<script lang="ts">
import { toRefs } from '@nuxtjs/composition-api';
import {
  CreateConfirmDialogKey,
  CreateConfirmDialogOptions,
} from '~/composables';

export default defineComponent({
  name: 'DialogProvider',
  setup() {
    const state = reactive({
      isOpen: false,
      resolve: (_val: boolean) => {},
      reject: (_val: boolean) => {},
      content: '',
      title: '',
      options: {
        width: 350,
        showCancel: true,
        persistent: false,
      } as CreateConfirmDialogOptions,
    });

    const createConfirmDialog = (
      title: string,
      content: string,
      options: CreateConfirmDialogOptions = {}
    ) => {
      state.isOpen = true;
      state.title = title;
      state.content = content;
      state.options = {
        ...state.options,
        ...options,
      };
      return new Promise<boolean>((resolve, reject) => {
        state.resolve = resolve;
        state.reject = reject;
      });
    };

    provide(CreateConfirmDialogKey, createConfirmDialog);

    const agree = () => {
      state.resolve(true);
      state.isOpen = false;
    };

    const cancel = () => {
      state.resolve(false);
      state.isOpen = false;
    };

    return {
      ...toRefs(state),
      agree,
      cancel,
    };
  },
});
</script>
