<template>
  <VDialog v-model="dialog" max-width="500">
    <template #activator="{ on, attrs }">
      <VBtn icon color="primary" v-bind="attrs" v-on="on">
        <VIcon>mdi-account-multiple-outline</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle
        >Tag People <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn></VCardTitle
      >
      <VCardText>
        <VChip
          v-for="(selection, i) in taggedFriends"
          :key="selection.guid"
          :disabled="isLoading"
          close
          class="mr-2 mb-4"
          @click:close="$emit('remove:taggedFriends', i)"
        >
          {{ selection.username }}
        </VChip>
        <div class="d-flex">
          <VTextField
            v-model="input"
            prepend-inner-icon="mdi-magnify"
            single-line
            placeholder="Search for friends"
            :loading="isLoading"
            outlined
            dense
            clearable
            autofocus
            class="mr-2"
          >
          </VTextField>
          <VBtn text color="primary" @click="dialog = false">Done</VBtn>
        </div>
        <VList v-if="data" class="pa-0">
          <template v-for="user in data">
            <VListItem
              v-if="!taggedFriends.includes(user)"
              :key="user.guid"
              :disabled="isLoading"
              @click="$emit('add:taggedFriends', user)"
            >
              <VListItemAvatar>
                <VImg :src="user.icon.smaller" />
              </VListItemAvatar>
              <VListItemContent>
                <VListItemTitle v-text="user.username"></VListItemTitle>
              </VListItemContent>
            </VListItem>
          </template>
        </VList>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import { useFriendSearch, User } from '~/composables';

export default defineComponent({
  name: 'PostFormTagUserListDialog',
  props: {
    taggedFriends: {
      type: Array as PropType<User[]>,
      required: true,
    },
  },
  emits: ['add:taggedFriends', 'remove:taggedFriends'],
  setup() {
    const dialog = ref(false);
    const input = ref('');

    const { data, isLoading } = useFriendSearch(input);

    watch(dialog, () => {
      if (!dialog.value) {
        input.value = '';
      }
    });

    return {
      dialog,
      input,
      data,
      isLoading,
    };
  },
});
</script>
