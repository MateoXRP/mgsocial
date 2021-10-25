<template>
  <VDialog v-model="dialog" max-width="500">
    <template #activator="{ on, attrs }">
      <VBtn icon color="primary" v-bind="attrs" v-on="on">
        <VIcon>mdi-map-marker-outline</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle
        >Search for location <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn></VCardTitle
      >
      <VCardText>
        <VTextField
          v-model="input"
          prepend-inner-icon="mdi-magnify"
          single-line
          placeholder="Where are you?"
          :loading="isLoading"
          outlined
          dense
          clearable
          autofocus
        ></VTextField>
        <VList v-if="data && data.success" class="pa-0" two-line>
          <VListItem
            v-for="place in data.places"
            :key="place.id"
            @click="selectLocation(place.text)"
          >
            <VListItemContent>
              <VListItemTitle v-text="place.text"></VListItemTitle>
              <VListItemSubtitle v-text="place.placeName"></VListItemSubtitle>
            </VListItemContent>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { usePlacesSearch } from '~/composables';

export default defineComponent({
  name: 'PostFormAddLocationDialog',
  emits: ['update:location'],
  setup(_props, { emit }) {
    const dialog = ref(false);
    const input = ref('');

    const { data, isLoading } = usePlacesSearch(input);

    watch(dialog, () => {
      if (!dialog.value) {
        input.value = '';
      }
    });

    const selectLocation = (place: string) => {
      emit('update:location', place);
      dialog.value = false;
    };

    return {
      dialog,
      input,
      data,
      isLoading,
      selectLocation,
    };
  },
});
</script>
