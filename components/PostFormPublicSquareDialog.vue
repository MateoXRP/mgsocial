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
          initialValue ? 'mdi-alpha-p-circle' : 'mdi-alpha-p-circle-outline'
        }}</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle class="pb-0">
        Send to Public Square? <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn></VCardTitle
      >
      <VRadioGroup
        v-model="temporaryValue"
        active-class=""
        dense
        hide-details
        readonly
      >
        <VListItem two-line @click="temporaryValue = true">
          <VListItemAvatar>
            <VIcon>mdi-alpha-p-circle</VIcon>
          </VListItemAvatar>
          <VListItemContent>
            <VListItemTitle>Enable</VListItemTitle>
            <VListItemSubtitle>Spend 1 MGS token.</VListItemSubtitle>
          </VListItemContent>
          <VListItemAction>
            <VRadio color="primary" :value="true" :ripple="false"></VRadio>
          </VListItemAction>
        </VListItem>
        <VListItem @click="temporaryValue = false">
          <VListItemAvatar>
            <VIcon>mdi-alpha-p-circle-outline</VIcon>
          </VListItemAvatar>
          <VListItemContent>
            <VListItemTitle>Disable</VListItemTitle>
          </VListItemContent>
          <VListItemAction>
            <VRadio color="primary" :value="false" :ripple="false"></VRadio>
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
import { useCurrentUser } from '~/composables';

export default defineComponent({
  name: 'PostFormPublicSquareDialog',
  props: {
    initialValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:shouldPostToPublicSquare'],
  setup(props, { emit }) {
    const currentUser = useCurrentUser();
    const dialog = ref(false);
    const temporaryValue = ref(false);

    watch(dialog, (val) => {
      if (val) {
        temporaryValue.value = props.initialValue;
      }
    });

    const save = () => {
      emit('update:shouldPostToPublicSquare', temporaryValue.value);
      dialog.value = false;
    };

    return {
      dialog,
      temporaryValue,
      save,
      currentUser,
    };
  },
});
</script>
