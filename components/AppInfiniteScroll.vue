<template>
  <div ref="root">
    <slot v-if="isIntersecting" name="placeholder">
      <div class="pa-2 text-center">Loading...</div>
    </slot>
    <slot v-if="isComplete" name="no-more"></slot>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';

const defaultOptions = {
  threshold: 0 as number | number[],
  rootMargin: '0px',
  root: null,
};

export default defineComponent({
  name: 'AppInfiniteScroll',
  props: {
    options: {
      type: Object as PropType<typeof defaultOptions>,
      default: () => defaultOptions,
      required: false,
    },
  },
  emits: ['infinite'],
  setup(props, { emit }) {
    let observer: IntersectionObserver;
    const root = ref<HTMLDivElement>();
    const isIntersecting = ref(false);
    const isComplete = ref(false);

    onMounted(() => {
      observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting && root.value) {
          isIntersecting.value = true;
          observer.unobserve(root.value);
          emit('infinite', {
            loaded() {
              isIntersecting.value = false;
              observer.observe(root.value!);
            },
            complete() {
              observer?.disconnect();
              isIntersecting.value = false;
              isComplete.value = true;
            },
          });
        }
      }, props.options);

      if (root.value) {
        observer.observe(root.value);
      }
    });

    onUnmounted(() => {
      observer?.disconnect();
    });

    return {
      root,
      isIntersecting,
      isComplete,
    };
  },
});
</script>
