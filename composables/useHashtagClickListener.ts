import type { ComputedRef, Ref } from '@nuxtjs/composition-api';

export const useHashtagClickListener = (
  data: ComputedRef<any> | Ref<any>,
  cb?: (e: Event) => void
) => {
  const router = useRouter();
  const isMounted = ref(false);
  const listener = (e: Event) => {
    e.preventDefault();
    if (cb) {
      cb(e);
    } else {
      // @ts-ignore
      const href = e.target.getAttribute('href');
      router.push(href);
    }
  };

  const addEventListeners = () => {
    document.querySelectorAll('.hashtag').forEach((el) => {
      el.addEventListener('click', listener);
    });
  };

  const removeEventListeners = () => {
    document.querySelectorAll('.hashtag').forEach((el) => {
      el.removeEventListener('click', listener);
    });
  };

  onMounted(() => {
    isMounted.value = true;
  });

  watchEffect(() => {
    if (
      !data.value ||
      (data.value && Array.isArray(data.value) && !data.value.length) ||
      !isMounted.value
    )
      return;
    removeEventListeners();
    nextTick(addEventListeners);
  });

  onUnmounted(() => {
    removeEventListeners();
  });
};
