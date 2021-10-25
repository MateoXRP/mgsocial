import type { ComputedRef, Ref } from '@nuxtjs/composition-api';
import { triggerRef } from '@nuxtjs/composition-api';
import { useStorage } from '@vueuse/core';
import { useQuery } from 'vue-query';
import { PostRecord, useCurrentUserId } from '.';
import type { MonetizationEvent } from '~/types/monetization';

interface CoilPaymentBody {
  userId: string;
  paymentpointer: string;
  amount: number;
  assetScale: number;
  assetCode: string;
}

const useSaveStoredPayments = (paymentsStorage: Ref<CoilPaymentBody[]>) => {
  const { $axios } = useContext();
  const currentUserId = useCurrentUserId();

  const paymentsMap = computed(() => {
    const arr: CoilPaymentBody[] = [];
    paymentsStorage.value.forEach((payment) => {
      const { userId } = payment;
      const index = arr.findIndex((i) => i.userId === userId);
      if (index === -1) {
        arr.push(payment);
      } else {
        arr[index].amount = arr[index].amount + payment.amount;
      }
    });
    return arr;
  });

  const options = reactive({
    queryKey: ['save-payments'],
    queryFn: () => {
      return $axios.$post('/api/save_payments', {
        guid: currentUserId.value,
        payments: JSON.stringify(paymentsMap.value),
      });
    },
    refetchInterval: 60000, // every 1 minute
    cacheTime: 0,
    retry: 3,
    enabled: paymentsStorage.value.length > 0,
    onSuccess() {
      paymentsStorage.value = [];
    },
  });

  return useQuery(options);
};

const roundOff = (amount: string, assetScale: number) =>
  (Number(amount) * Math.pow(10, -assetScale)).toFixed(assetScale);

export const usePostMonetization = (
  data: ComputedRef<PostRecord[]> | Ref<PostRecord[]>
) => {
  const counterMap = shallowRef<Record<any, any>>({});
  const currentUserId = useCurrentUserId();
  const observer = ref<IntersectionObserver>();
  // TODO: Improve by converting to object
  const postsInViewport = ref<PostRecord[]>([]);
  const paymentsStorage = useStorage<CoilPaymentBody[]>(
    'streamed-payments',
    []
  );

  const { isFetching: isSavingPayments } =
    useSaveStoredPayments(paymentsStorage);

  const saveToPaymentsStorage = (payment: CoilPaymentBody) => {
    paymentsStorage.value.push(payment);
  };

  const sortedPostsInViewport = computed(() => {
    return postsInViewport.value.sort((a, b) => {
      return Number(b.post.time_created) - Number(a.post.time_created);
    });
  });

  const selectedPostInViewport = computed(() => {
    if (sortedPostsInViewport.value.length)
      return sortedPostsInViewport.value[0];

    return null;
  });

  const selectedPaymentPointer = computed(() => {
    if (selectedPostInViewport.value && !isSavingPayments.value) {
      return selectedPostInViewport.value.user.paymentpointer;
    }

    return '';
  });

  onMounted(() => {
    if (process.env.NODE_ENV === 'development') return;

    watchEffect(() => {
      document
        .querySelector('meta[name="monetization"]')
        ?.setAttribute('content', selectedPaymentPointer.value);
    });
  });

  const monetizationEventHandler = (e: MonetizationEvent) => {
    // TODO: Save to database
    if (!selectedPostInViewport.value) return;
    const postId = selectedPostInViewport.value.post.guid;
    const userId = selectedPostInViewport.value.user.guid;
    if (e.type === 'monetizationprogress') {
      const { assetScale, assetCode, paymentPointer } = e.detail;

      if (counterMap.value[postId]) {
        const { total: currentTotal } = counterMap.value[postId];
        const updatedTotal = currentTotal + Number(e.detail.amount);
        const formatted = roundOff(updatedTotal, assetScale);
        const formattedCounter = `${assetCode} ${formatted}`;
        counterMap.value[postId] = {
          total: updatedTotal,
          counter: formattedCounter,
        };
      } else {
        const formatted = roundOff(e.detail.amount, assetScale);
        const formattedCounter = `${assetCode} ${formatted}`;
        counterMap.value[postId] = {
          total: Number(e.detail.amount),
          counter: formattedCounter,
        };
      }

      saveToPaymentsStorage({
        userId,
        paymentpointer: paymentPointer,
        amount: Number(roundOff(e.detail.amount, assetScale)),
        assetScale,
        assetCode,
      });

      triggerRef(counterMap);
    }
  };

  const addEventListeners = () => {
    document.monetization?.addEventListener(
      'monetizationstart',
      monetizationEventHandler
    );
    document.monetization?.addEventListener(
      'monetizationprogress',
      monetizationEventHandler
    );
  };

  const removeEventListeners = () => {
    document.monetization?.removeEventListener(
      'monetizationstart',
      monetizationEventHandler
    );
    document.monetization?.removeEventListener(
      'monetizationprogress',
      monetizationEventHandler
    );
    observer.value?.disconnect();
  };

  const getPostById = (id: string) =>
    data.value.find((i) => i.post.guid === id);

  const removePostInViewportList = (postId: string) => {
    const index = postsInViewport.value.findIndex(
      (i) => i.post.guid === postId
    );
    if (index !== -1) {
      postsInViewport.value.splice(index, 1);
    }
  };

  const handleIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const postId = entry.target.getAttribute('data-post-id') as string;
      const post = getPostById(postId)!;
      if (
        entry.intersectionRatio > 0.75 &&
        currentUserId.value !== post.user.guid
      ) {
        postsInViewport.value.push(post);
      } else {
        removePostInViewportList(postId);
      }
    });
  };

  const observePosts = () => {
    observer.value?.disconnect();
    postsInViewport.value = [];
    const postElements = document.querySelectorAll('.post');
    if (!postElements.length) return;

    observer.value = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 0.75,
    });

    postElements.forEach((el) => {
      const paymentpointer = el.getAttribute('data-paymentpointer');
      const isMonetized = el.getAttribute('data-is-monetized') === '1';
      if (paymentpointer && isMonetized) {
        observer.value?.observe(el);
      }
    });
  };

  watchEffect(() => {
    if (
      !data.value ||
      (data.value && Array.isArray(data.value) && !data.value.length)
    ) {
      return;
    }
    nextTick(() => {
      observePosts();
    });
  });

  onMounted(addEventListeners);
  onUnmounted(removeEventListeners);

  const currentCounter = computed(() => {
    if (
      selectedPostInViewport.value &&
      counterMap.value[selectedPostInViewport.value.post.guid]
    ) {
      return counterMap.value[selectedPostInViewport.value.post.guid];
    }

    return null;
  });

  return {
    selectedPostInViewport,
    currentCounter,
    isSavingPayments,
  };
};
