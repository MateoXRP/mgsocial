import type { PostRecord } from '.';

export const usePostTips = (post: PostRecord) => {
  const tipsSummarized = computed(() => {
    const tips = post.xumm_tips_new ?? [];
    if (tips.length === 1 && tips[0].amount === 0) {
      return [];
    }

    const list: { currency: string; total: number }[] = [];

    tips.forEach((tip) => {
      const exists = list.find((i) => i.currency === tip.currency);

      if (!exists) {
        const total = tips
          .filter((i) => i.currency === tip.currency)
          .reduce((a, b) => a + Number(b.amount), 0);
        if (total) {
          list.push({
            currency: tip.currency,
            total,
          });
        }
      }
    });

    return list;
  });

  const totalTips = computed(() => {
    const tips = post.xumm_tips_new ?? [];
    if (tips.length === 1 && tips[0].amount === 0) {
      return 0;
    }

    return tips.reduce((a, b) => a + Number(b.amount), 0);
  });

  const tipsText = computed(
    () =>
      `${totalTips.value} ${
        totalTips.value > 1 || totalTips.value === 0 ? 'tips' : 'tip'
      }`
  );

  return {
    tipsSummarized,
    totalTips,
    tipsText,
  };
};
