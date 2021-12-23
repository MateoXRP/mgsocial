<template>
  <VCard>
    <VCardTitle>Account Settings</VCardTitle>
    <VForm ref="form" v-model="valid" lazy-validation>
      <VTabs vertical>
        <VTab>Personal Info</VTab>
        <VTab>Monetization</VTab>
        <VTabItem>
          <VCardText
            ><VTextField
              v-model="personalInfo.firstName"
              label="First name"
              dense
              outlined
              :rules="rules.firstName"
              required
            />
            <VTextField
              v-model="personalInfo.lastName"
              label="Last name"
              dense
              outlined
              :rules="rules.lastName"
              required
            />
            <VTextField
              v-model="personalInfo.username"
              label="Username"
              dense
              outlined
              :rules="rules.username"
              required
            />

            <template v-if="$accessor.auth.coilInfo">
              <VTextField
                :value="$accessor.auth.coilInfo.email"
                label="Coil Email"
                type="email"
                dense
                outlined
                readonly
              />
              <VTextField
                :value="$accessor.auth.coilInfo.sub"
                label="Coil ID"
                type="email"
                dense
                outlined
                readonly
              />
            </template>
          </VCardText>
        </VTabItem>
        <VTabItem>
          <VCardText>
            <VTextField
              v-model="monetization.paymentPointer"
              label="Payment Pointer"
              dense
              outlined
            />
            <VTextField
              v-model="monetization.xummAddress"
              label="Xumm Address"
              dense
              outlined
              readonly
              append-icon="mdi-qrcode-scan"
              hint="Click the QR code icon to link Xumm account and to approve tips via push notifications"
              persistent-hint
              @click:append="linkXummAccount"
            />
          </VCardText>
        </VTabItem>
      </VTabs>
    </VForm>
    <VCardActions>
      <VSpacer />
      <VBtn
        depressed
        color="primary"
        :disabled="!valid"
        :loading="isLoading"
        @click="submit"
        >Save</VBtn
      >
    </VCardActions>
  </VCard>
</template>

<script lang="ts">
import { useSnackbar, useUserUpdate, useXummSignIn } from '~/composables';
import createTemporaryLink from '~/utils/create-temporary-link';

const rules = {
  firstName: [(v: string) => !!v || 'First name is required'],
  lastName: [(v: string) => !!v || 'Last name is required'],
  username: [(v: string) => !!v || 'Username is required'],
  email: [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
  ],
};

export default defineComponent({
  layout: 'authenticated',
  setup() {
    const selectedTab = ref('tab-personal');
    const form = ref();
    const valid = ref(true);
    const {
      app: { $accessor },
    } = useContext();
    const personalInfo = ref({
      firstName: $accessor.auth.user?.first_name,
      lastName: $accessor.auth.user?.last_name,
      username: $accessor.auth.user?.username,
      email: $accessor.auth.user?.email,
    });
    const monetization = ref({
      paymentPointer: $accessor.auth.user?.paymentpointer,
      xummAddress: $accessor.auth.user?.xummaddress,
    });
    const updateUser = useUserUpdate();
    const showSnackbar = useSnackbar();
    const xummSignIn = useXummSignIn();
    const isLoading = computed(() => updateUser.isLoading.value);

    const submit = async () => {
      const isValid = form.value.validate();

      if (!isValid) return;

      const { firstName, lastName, username, email } = personalInfo.value;
      const { paymentPointer, xummAddress } = monetization.value;

      try {
        await updateUser.mutateAsync({
          first_name: firstName!,
          last_name: lastName!,
          username: username!,
          email: email!,
          payment_pointer: paymentPointer!,
          xumm_address: xummAddress!,
        });
        showSnackbar('Account updated');
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

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
      selectedTab,
      valid,
      personalInfo,
      monetization,
      rules,
      submit,
      form,
      isLoading,
      linkXummAccount,
    };
  },
});
</script>
