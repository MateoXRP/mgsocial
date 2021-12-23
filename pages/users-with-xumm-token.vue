<template>
  <VCard elevation="1">
    <VCardTitle>
      Users with Xumm token
      <VSpacer />
      <VTextField
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </VCardTitle>
    <VDataTable
      :loading="isLoading"
      :headers="headers"
      :items="users"
      :search="search"
    />
  </VCard>
</template>

<script lang="ts">
import { useUserWithXummTokenList } from '~/composables';

export default defineComponent({
  layout: 'authenticated',
  middleware: ['auth', 'admin'],
  setup() {
    const { data, isLoading } = useUserWithXummTokenList();
    const search = ref('');
    const headers = [
      { text: 'User ID', value: 'guid' },
      { text: 'Email', value: 'email' },
      { text: 'Username', value: 'username' },
      { text: 'Xumm token', value: 'tokensCombined' },
    ];

    const users = computed(() => {
      if (!data.value) return [];

      return data.value.map((user) => ({
        ...user,
        tokensCombined: user.tokens.map((token) => token.token).join(', '),
      }));
    });

    return {
      isLoading,
      search,
      users,
      headers,
    };
  },
});
</script>
