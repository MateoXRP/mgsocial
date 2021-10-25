<template>
  <VDialog v-model="dialog" max-width="350">
    <template #activator="{ on, attrs }">
      <VListItem v-bind="attrs" v-on="on">
        <VListItemIcon>
          <VIcon>mdi-newspaper-variant-outline</VIcon>
        </VListItemIcon>
        <VListItemContent>
          <VListItemTitle>News Feed Filter</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </template>
    <VCard>
      <VCardTitle class="pb-0"> News Feed Filter </VCardTitle>
      <VCardText>
        <p>Filter posts by</p>

        <VRadioGroup
          v-model="privacy"
          active-class=""
          dense
          hide-details
          readonly
        >
          <VListItem @click="setPrivacy(PostPrivacy.Public)">
            <VListItemAvatar>
              <VIcon>mdi-earth</VIcon>
            </VListItemAvatar>
            <VListItemContent>
              <VListItemTitle>Public</VListItemTitle>
            </VListItemContent>
            <VListItemAction>
              <VRadio
                color="primary"
                :value="PostPrivacy.Public"
                :ripple="false"
              ></VRadio>
            </VListItemAction>
          </VListItem>
          <VListItem @click="setPrivacy(PostPrivacy.Friends)">
            <VListItemAvatar>
              <VIcon>mdi-account-multiple</VIcon>
            </VListItemAvatar>
            <VListItemContent>
              <VListItemTitle>Friends</VListItemTitle>
            </VListItemContent>
            <VListItemAction>
              <VRadio
                color="primary"
                :value="PostPrivacy.Friends"
                :ripple="false"
              ></VRadio>
            </VListItemAction>
          </VListItem>
        </VRadioGroup>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { PostPrivacy } from '~/composables';

export default defineComponent({
  name: 'NewsFeedFilterDialog',
  emits: ['update:menu'],
  setup(_props, { emit }) {
    const dialog = ref(false);
    const {
      app: { $accessor },
    } = useContext();

    watch(dialog, (val) => {
      if (val) {
        emit('update:menu', false);
      }
    });

    const privacy = computed(() => $accessor.newsFeedFilter);

    return {
      dialog,
      privacy,
      setPrivacy: $accessor.setNewsFeedFilter,
      PostPrivacy,
    };
  },
});
</script>
