<template>
  <VDialog v-model="dialog" max-width="400">
    <template #activator="{ on, attrs }">
      <VBtn text color="primary" v-bind="attrs" v-on="on">
        <VIcon left>{{
          initialValue === PostPrivacy.Public
            ? 'mdi-earth'
            : 'mdi-account-multiple'
        }}</VIcon>
        {{ initialValue === PostPrivacy.Public ? 'Public' : 'Friends' }}
      </VBtn>
    </template>
    <VCard>
      <VCardTitle class="pb-0">
        Who can see this post? <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn></VCardTitle
      >
      <VRadioGroup
        v-model="privacyTemp"
        active-class=""
        dense
        hide-details
        readonly
      >
        <VListItem @click="privacyTemp = PostPrivacy.Public">
          <VListItemAvatar>
            <VIcon>mdi-earth</VIcon>
          </VListItemAvatar>
          <VListItemContent>
            <VListItemTitle>Public</VListItemTitle>
            <VListItemSubtitle
              >Everyone on this site can see this.</VListItemSubtitle
            >
          </VListItemContent>
          <VListItemAction>
            <VRadio
              color="primary"
              :value="PostPrivacy.Public"
              :ripple="false"
            ></VRadio>
          </VListItemAction>
        </VListItem>
        <VListItem @click="privacyTemp = PostPrivacy.Friends">
          <VListItemAvatar>
            <VIcon>mdi-account-multiple</VIcon>
          </VListItemAvatar>
          <VListItemContent>
            <VListItemTitle>Friends</VListItemTitle>
            <VListItemSubtitle
              >Only your friends can see this.
            </VListItemSubtitle>
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
import { PostPrivacy } from '~/composables';

export default defineComponent({
  name: 'PostFormPrivacyDialog',
  props: {
    initialValue: {
      type: String as PropType<PostPrivacy>,
      required: true,
    },
  },
  emits: ['update:privacy'],
  setup(props, { emit }) {
    const dialog = ref(false);
    const privacyTemp = ref(PostPrivacy.Public);

    watch(dialog, (val) => {
      if (val) {
        privacyTemp.value = props.initialValue;
      }
    });

    const save = () => {
      emit('update:privacy', privacyTemp.value);
      dialog.value = false;
    };

    return {
      dialog,
      privacyTemp,
      PostPrivacy,
      save,
    };
  },
});
</script>
