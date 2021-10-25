<template>
  <VDialog v-model="dialog" max-width="500">
    <template #activator="{ on, attrs }">
      <VBtn text class="social-btn" v-bind="attrs" v-on="on">
        <VIcon left>mdi-heart-outline</VIcon>
        Tip
      </VBtn>
    </template>
    <VCard>
      <VCardTitle
        >{{ isLoadingTrustLineData ? 'Checking trust lines...' : 'Tip post' }}
        <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <VSelect
              v-model="token"
              label="Token"
              :items="currencies"
              item-text="token"
              return-object
              outlined
              hide-details
              :disabled="isLoadingTrustLineData"
            />
          </VCol>
          <VCol cols="12" md="9">
            <VTextField
              v-model.number="amount"
              label="Amount"
              outlined
              hide-details
              type="number"
              :disabled="isLoadingTrustLineData"
            />
          </VCol>
          <VCol cols="12">
            <span class="hover-underline primary--text" @click="linkXummAccount"
              >Click here to link Xumm account to approve tips via push
              notifications</span
            >
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" text @click="dialog = false"> Cancel </VBtn>
        <VBtn
          color="primary"
          depressed
          :disabled="!amount || isLoadingTrustLineData"
          :loading="isLoading || isLoadingTrustLineData"
          @click="submit"
        >
          Xumm Tip
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import {
  useCreateXummPayload,
  useSnackbar,
  useTrustLine,
  useXummSignIn,
  useXummUserToken,
} from '~/composables';
import createTemporaryLink from '~/utils/create-temporary-link';

const initialCurrencies = [
  {
    token: 'XRP',
    issuer: '',
  },
];

export default defineComponent({
  name: 'PostItemTipDialog',
  props: {
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    xummAddress: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const dialog = ref(false);
    const currencies = ref(initialCurrencies);
    const token = ref(currencies.value[0]);
    const amount = ref('1');
    const { data: trustlineData, isLoading: isLoadingTrustLineData } =
      useTrustLine(props.xummAddress, dialog);
    const { $config } = useContext();
    const getXummUserToken = useXummUserToken();
    const createXummPayload = useCreateXummPayload();
    const showSnackbar = useSnackbar();
    const xummSignIn = useXummSignIn();

    watch(trustlineData, (trustLines) => {
      if (trustLines) {
        const specs = trustLines
          .filter((spec) =>
            ($config.xrplTokens as string[]).includes(spec.currency)
          )
          .map((spec) => ({
            token: spec.currency,
            issuer: spec.account,
          }));
        currencies.value = [...initialCurrencies, ...specs];
      }
    });

    const submit = async () => {
      try {
        const body = {
          destination: props.xummAddress,
          userToken: '',
          receiverId: props.userId,
          postId: props.postId,
          currency: token.value.token,
          issuer: token.value.issuer,
          amount: amount.value,
        };

        const { payload } = await getXummUserToken.mutateAsync();
        if (payload && payload.user_token) {
          body.userToken = payload.user_token;
        }

        const { result, success } = await createXummPayload.mutateAsync(body);
        if (success && result) {
          location.href = result.next.always;
          showSnackbar('Please wait...');
        } else {
          showSnackbar('An error occurred');
        }
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

    const isLoading = computed(() => {
      return (
        getXummUserToken.isLoading.value || createXummPayload.isLoading.value
      );
    });

    const linkXummAccount = async () => {
      try {
        const result = await xummSignIn.mutateAsync();
        if (result && result.next) {
          createTemporaryLink(result.next.always);
        }
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

    return {
      dialog,
      submit,
      isLoading,
      token,
      amount,
      currencies,
      isLoadingTrustLineData,
      linkXummAccount,
    };
  },
});
</script>
