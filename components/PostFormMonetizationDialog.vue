<template>
  <VDialog v-model="dialog" max-width="400">
    <template #activator="{ on, attrs }">
      <VBtn
        :disabled="!currentUser || !currentUser.paymentpointer"
        icon
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <VIcon>{{
          initialValue === Monetized.Yes
            ? 'mdi-currency-usd'
            : 'mdi-currency-usd-off'
        }}</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle class="pb-0">
        Monetize this post? <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn></VCardTitle
      >
      <VRadioGroup
        v-model="monetizedTemp"
        active-class=""
        dense
        hide-details
        readonly
      >
        <VListItem two-line @click="monetizedTemp = Monetized.Yes">
          <VListItemAvatar>
            <VIcon>mdi-currency-usd</VIcon>
          </VListItemAvatar>
          <VListItemContent>
            <VListItemTitle>Enable monetization</VListItemTitle>
            <VListItemSubtitle>Powered by Coil and Xumm.</VListItemSubtitle>
          </VListItemContent>
          <VListItemAction>
            <VRadio
              color="primary"
              :value="Monetized.Yes"
              :ripple="false"
            ></VRadio>
          </VListItemAction>
        </VListItem>
        <VListItem @click="monetizedTemp = Monetized.No">
          <VListItemAvatar>
            <VIcon>mdi-currency-usd-off</VIcon>
          </VListItemAvatar>
          <VListItemContent>
            <VListItemTitle>Disable monetization</VListItemTitle>
          </VListItemContent>
          <VListItemAction>
            <VRadio
              color="primary"
              :value="Monetized.No"
              :ripple="false"
            ></VRadio>
          </VListItemAction>
        </VListItem>
      </VRadioGroup>
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" text @click="dialog = false"> Cancel </VBtn>
        <VBtn color="primary" text @click="save"> Save </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import { useCurrentUser } from '~/composables';
import { Monetized } from '~/composables/useCreatePost';

export default defineComponent({
  name: 'PostFormMonetizationDialog',
  props: {
    initialValue: {
      type: String as PropType<Monetized>,
      required: true,
    },
  },
  emits: ['update:isMonetizationEnabled'],
  setup(props, { emit }) {
    const currentUser = useCurrentUser();
    const dialog = ref(false);
    const monetizedTemp = ref(
      currentUser.value?.paymentpointer ? Monetized.Yes : Monetized.No
    );

    watch(dialog, (val) => {
      if (val) {
        monetizedTemp.value = props.initialValue;
      }
    });

    const save = () => {
      emit('update:isMonetizationEnabled', monetizedTemp.value);
      dialog.value = false;
    };

    return {
      dialog,
      monetizedTemp,
      Monetized,
      save,
      currentUser,
    };
  },
});
</script>
