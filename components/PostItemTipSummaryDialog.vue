<template>
  <VDialog v-model="dialog" max-width="400">
    <template #activator="{ on, attrs }">
      <span v-bind="attrs" class="hover-underline mr-1" v-on="on">{{
        text
      }}</span>
    </template>
    <VCard>
      <VCardTitle
        >Tips
        <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn></VCardTitle
      >
      <VCardText>
        <VList v-if="tips.length > 0">
          <VListItem v-for="tip in tips" :key="tip.currency">
            <VListItemContent>
              <VListItemTitle
                >{{ tip.currency }}: {{ tip.total }}</VListItemTitle
              >
            </VListItemContent>
          </VListItem>
        </VList>
        <p v-else>No tips yet.</p>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'PostItemTipSummaryDialog',
  props: {
    text: {
      type: String,
      required: true,
    },
    tips: {
      type: Array as PropType<
        {
          currency: string;
          total: number;
        }[]
      >,
      required: true,
    },
  },
  setup() {
    const dialog = ref(false);

    return {
      dialog,
    };
  },
});
</script>
