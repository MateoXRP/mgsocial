<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height class="pa-0 ma-0">
        <SnackbarProvider>
          <Nuxt />
        </SnackbarProvider>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import SnackbarProvider from '~/components/SnackbarProvider.vue';

export default defineComponent({
  components: {
    SnackbarProvider,
  },
});
</script>
