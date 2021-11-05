<template>
  <VCard elevation="1">
    <VCardTitle>
      Users with Coil ID
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
      :items="items"
      :search="search"
    />
  </VCard>
</template>

<script lang="ts">
import { useUserWithCoilIdList } from '~/composables';

export default defineComponent({
  layout: 'authenticated',
  middleware: ['auth', 'admin'],
  setup() {
    const { data, isLoading } = useUserWithCoilIdList();
    const search = ref('');
    const headers = [
      { text: 'User ID', value: 'guid' },
      { text: 'Email', value: 'email' },
      { text: 'Username', value: 'username' },
      { text: 'First name', value: 'first_name' },
      { text: 'Last name', value: 'last_name' },
      { text: 'Coil ID', align: 'start', value: 'coil_id' },
    ];

    const items = computed(() => {
      if (!data.value || (data.value && !data.value.payload)) return [];

      return data.value.payload;
    });

    return {
      isLoading,
      search,
      items,
      headers,
    };
  },
});
</script>
