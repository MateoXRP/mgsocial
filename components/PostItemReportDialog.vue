<template>
  <VDialog v-model="dialog" max-width="500">
    <template #activator="{ on, attrs }">
      <VListItem v-bind="attrs" v-on="on">
        <VListItemTitle>Report this</VListItemTitle>
      </VListItem>
    </template>
    <VCard>
      <VCardTitle>Report post</VCardTitle>
      <VCardText>
        <VTextarea
          v-model="reason"
          outlined
          rows="2"
          hide-details
          auto-grow
          no-resize
          label="Reason"
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" text @click="dialog = false"> Cancel </VBtn>
        <VBtn
          color="primary"
          :disabled="!reason"
          :loading="isLoading"
          text
          @click="sendReport"
        >
          Submit
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { useSnackbar } from '~/composables';
import { useCreateReport } from '~/composables/useCreateReport';

export default defineComponent({
  name: 'PostItemReportDialog',
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const reason = ref('');
    const createReport = useCreateReport();
    const showSnackbar = useSnackbar();

    const sendReport = async () => {
      try {
        await createReport.mutateAsync({
          guid: props.postId,
          reason: reason.value,
        });
        showSnackbar('Report submitted');
        dialog.value = false;
        reason.value = '';
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

    const isLoading = computed(() => createReport.isLoading.value);

    return { dialog, reason, sendReport, isLoading };
  },
});
</script>
