<template>
  <div class="mt-2">
    <VTextarea
      v-model="text"
      placeholder="Write a comment..."
      outlined
      single-line
      dense
      hide-details
      rows="1"
      auto-grow
      :loading="isLoading"
      :disabled="isLoading"
      @keydown.enter.exact.prevent="createComment"
      @keydown.enter.shift.exact.prevent="text += '\n'"
    >
      <template slot="append">
        <AppEmojiPicker
          v-slot="{ activator }"
          bottom
          left
          @handleClick="text += $event"
        >
          <VIcon
            color="primary"
            v-bind="activator.attrs"
            class="mr-1"
            v-on="activator.on"
            >mdi-emoticon-outline</VIcon
          >
        </AppEmojiPicker>
        <VIcon color="primary" @click="openFileSelector"
          >mdi-camera-outline</VIcon
        >
      </template>
    </VTextarea>
    <div v-if="filesContent.length" class="comment-photo-container">
      <VImg
        class="mt-2 rounded"
        :src="filesContent[0].content"
        width="150"
      ></VImg>
      <VBtn
        :disabled="isLoading"
        fab
        x-small
        class="clear-photo-btn elevation-0"
        @click="clearPhoto"
      >
        <VIcon>mdi-close</VIcon>
      </VBtn>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import AppEmojiPicker from './AppEmojiPicker.vue';
import {
  CreateCommentBody,
  useCreateComment,
  useFilePicker,
  useSnackbar,
} from '~/composables';

export default defineComponent({
  name: 'PostItemCommentForm',
  components: { AppEmojiPicker },
  props: {
    postId: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<'post' | 'entity'>,
      required: true,
    },
    itemGuid: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const mutate = useCreateComment();
    const createSnackbar = useSnackbar();
    const text = ref('');
    const {
      files,
      filesContent,
      openFileSelector,
      clear: clearPhoto,
    } = useFilePicker({
      accept: 'image/*',
      readAs: 'DataURL',
    });

    const clearFields = () => {
      text.value = '';
      clearPhoto();
    };

    const createComment = async () => {
      if (!text.value && !files.value.length) return;

      try {
        const body: CreateCommentBody = {
          subject_guid: props.type === 'entity' ? props.itemGuid : props.postId,
          type: props.type,
          comment: text.value.trim(),
          postId: props.postId,
        };

        if (files.value.length) {
          body.image_file = files.value[0];
        }

        await mutate.mutateAsync({ ...body });
        createSnackbar('Comment added');
        clearFields();
      } catch (_e) {
        createSnackbar('Error adding comment');
      }
    };

    return {
      text,
      createComment,
      isLoading: mutate.isLoading,
      filesContent,
      openFileSelector,
      clearPhoto,
    };
  },
});
</script>

<style>
.clear-photo-btn {
  position: absolute;
  left: 4px;
  top: 4px;
}

.comment-photo-container {
  position: relative;
}
</style>
