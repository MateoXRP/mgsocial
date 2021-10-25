<template>
  <VDialog v-model="dialog" max-width="350">
    <template #activator="{ on, attrs }">
      <VListItem v-bind="attrs" v-on="on">
        <VListItemIcon>
          <VIcon>mdi-theme-light-dark</VIcon>
        </VListItemIcon>
        <VListItemContent>
          <VListItemTitle>Theme</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </template>
    <VCard>
      <VCardTitle class="pb-0"> Dark Mode </VCardTitle>
      <VCardText>
        <p>Adjust the appearance of MG.Social.</p>

        <VRadioGroup
          v-model="isDark"
          active-class=""
          dense
          hide-details
          readonly
        >
          <VListItem @click="isDark = false">
            <VListItemContent>
              <VListItemTitle>Off</VListItemTitle>
            </VListItemContent>
            <VListItemAction>
              <VRadio color="primary" :value="false" :ripple="false"></VRadio>
            </VListItemAction>
          </VListItem>
          <VListItem @click="isDark = true">
            <VListItemContent>
              <VListItemTitle>On</VListItemTitle>
            </VListItemContent>
            <VListItemAction>
              <VRadio color="primary" :value="true" :ripple="false"></VRadio>
            </VListItemAction>
          </VListItem>
        </VRadioGroup>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { useThemeStorage } from '~/composables';

export default defineComponent({
  name: 'ThemeDialog',
  emits: ['update:menu'],
  setup(_props, { emit }) {
    const dialog = ref(false);
    const { $vuetify } = useContext();
    const isDark = useThemeStorage();

    watch(dialog, (val) => {
      if (val) {
        emit('update:menu', false);
      }
    });

    watch(isDark, (value) => {
      $vuetify.theme.dark = value;
    });

    return {
      dialog,
      isDark,
    };
  },
});
</script>
