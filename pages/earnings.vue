<template>
  <AppFragment>
    <VCard>
      <VCardTitle>Coil Payments</VCardTitle>
      <VCardText>
        <span
          v-if="currentUser && currentUser.paymentpointer"
          class="text-h5"
          >{{ coilPayments }}</span
        >
        <VBtn v-else nuxt to="/settings" color="primary" text
          >Add Payment Pointer</VBtn
        >
      </VCardText>
    </VCard>
    <VCard class="mt-2">
      <VCardTitle>Xumm Tips</VCardTitle>
      <VCardText
        ><VSimpleTable v-if="currentUser && currentUser.xummaddress">
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Token</th>
                <th class="text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tipsSummarized" :key="item.currency">
                <td>{{ item.currency }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
          </template>
        </VSimpleTable>
        <VBtn v-else nuxt to="/settings" color="primary" text
          >Add Xumm Address</VBtn
        >
      </VCardText>
    </VCard>
    <VCard class="mt-2" :loading="isLoadingTotalRewards">
      <VCardTitle>Total MGS Rewards</VCardTitle>
      <VCardText>
        <span v-if="currentUser && currentUser.xummaddress" class="text-h5">{{
          totalRewards ? totalRewards.amount : 0
        }}</span>
        <VBtn v-else nuxt to="/settings" color="primary" text
          >Add Xumm Address</VBtn
        >
      </VCardText>
    </VCard>
  </AppFragment>
</template>

<script lang="ts">
import {
  useCurrentUser,
  useTotalRewards,
  useUserEarnings,
} from '~/composables';

export default defineComponent({
  layout: 'authenticated',
  setup() {
    const { data } = useUserEarnings();
    const { data: totalRewards, isLoading: isLoadingTotalRewards } =
      useTotalRewards();
    const currentUser = useCurrentUser();

    const tipsSummarized = computed(() => {
      if (!data.value || !data.value.payload) {
        return [];
      }

      return Object.keys(data.value.payload.xumm_tips_new).map((key) => {
        return {
          currency: key,
          // @ts-ignore
          total: data.value.payload.xumm_tips_new[key],
        };
      });
    });

    const coilPayments = computed(() => {
      if (!data.value) return `0`;

      return `${data.value.payload.coil_earnings_asset_code} ${data.value.payload.coil_earnings}`;
    });

    return {
      tipsSummarized,
      coilPayments,
      currentUser,
      isLoadingTotalRewards,
      totalRewards,
    };
  },
});
</script>
