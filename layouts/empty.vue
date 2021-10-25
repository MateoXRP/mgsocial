<template>
  <v-app :light="true">
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const { $vuetify } = useContext();
    $vuetify.theme.dark = false;
    return {};
  },
});
</script>
