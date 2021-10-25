<template>
  <AppFragment><slot /></AppFragment>
</template>

<script lang="ts">
import { useQuery } from 'vue-query';

const TWENTY_FIVE_MINUTES = 1500000;

export default defineComponent({
  setup() {
    const { app, $axios } = useContext();
    const enabled = ref(false);
    const isProduction = process.env.NODE_ENV === 'production';

    const fetchBTPToken = async () => {
      const { btpToken } = await $axios.$get('/api2/coil/get-btp-token');
      return btpToken;
    };

    const refreshAccessToken = async () => {
      const { access_token } = await $axios.$get(
        '/api2/coil/refresh-access-token'
      );
      return access_token as string;
    };

    const btpTokenOptions = reactive({
      refetchInterval: TWENTY_FIVE_MINUTES,
      enabled: enabled.value,
      onSuccess: (token: string) => {
        document.coilMonetizationPolyfill?.refreshBtpToken(token);
      },
    });

    useQuery(['btp_token'], fetchBTPToken, btpTokenOptions);

    const accessTokenOptions = reactive({
      refetchInterval: TWENTY_FIVE_MINUTES * 2,
      enabled: isProduction,
    });

    useQuery(['access_token'], refreshAccessToken, accessTokenOptions);

    onMounted(() => {
      if (!document.monetizationExtensionInstalled && isProduction) {
        const btpToken = app.$cookies.get('btp-token');
        document.coilMonetizationPolyfill?.init({ btpToken });
        enabled.value = true;
      }
    });

    return {};
  },
});
</script>
