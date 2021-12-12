<template>
  <AppFragment>
    <VCard
      elevation="1"
      :loading="isLoading"
      :disabled="isLoading"
      class="mb-2"
    >
      <VCardTitle>{{ isLoading ? 'Posting...' : 'Create Post' }}</VCardTitle>
      <VDivider></VDivider>
      <VCardText>
        <VTextarea
          id="post_form"
          v-model="text"
          outlined
          dense
          single-line
          hide-details
          placeholder="Write something here..."
          class="d-flex align-center justify-center"
          rows="1"
          no-resize
          auto-grow
          @keydown.alt.enter.exact.prevent="createPost"
        >
          <template #prepend>
            <VAvatar size="35px" item>
              <VImg v-if="user" :src="user.icon.small" alt="user icon" />
            </VAvatar>
          </template>
          <template #append>
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
          </template>
        </VTextarea>
        <div style="margin-left: 44px">
          <VChip
            v-if="taggedFriends.length > 0"
            outlined
            class="mt-1 mr-1"
            close
            label
            @click:close="taggedFriends = []"
            ><VIcon left>mdi-account-multiple-outline</VIcon
            >{{ taggedFriendsUsernames }}</VChip
          >
          <VChip
            v-if="location"
            outlined
            class="mt-1"
            close
            label
            @click:close="location = ''"
            ><VIcon left>mdi-map-marker-outline</VIcon>{{ location }}</VChip
          >
          <div v-if="filesContent.length" class="post-photo-container">
            <VImg
              class="mt-2 rounded"
              :src="filesContent[0].content"
              height="400"
            ></VImg>
            <VBtn
              fab
              small
              class="clear-photo-btn elevation-0"
              @click="clearPhoto"
            >
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </div>
        </div>
      </VCardText>
      <VDivider />
      <VCardActions>
        <VBtn icon color="primary" @click="openFileSelector">
          <VIcon>mdi-image-outline</VIcon>
        </VBtn>
        <PostFormTagUserListDialog
          ref="tagUserListDialog"
          :tagged-friends="taggedFriends"
          @add:taggedFriends="taggedFriends.push($event)"
          @remove:taggedFriends="taggedFriends.splice($event, 1)"
        />
        <PostFormAddLocationDialog :location.sync="location" />
        <PostFormMonetizationDialog
          :initial-value="isMonetizationEnabled"
          :is-monetization-enabled.sync="isMonetizationEnabled"
        />
        <PostFormPublicSquareDialog
          :initial-value="shouldPostToPublicSquare"
          :should-post-to-public-square.sync="shouldPostToPublicSquare"
        />
        <VSpacer />
        <PostFormPrivacyDialog
          :initial-value="privacy"
          :privacy.sync="privacy"
        />
        <VBtn
          depressed
          color="primary"
          :disabled="!text && !filesContent.length"
          @click="createPost"
          >Post</VBtn
        >
      </VCardActions>
    </VCard>
  </AppFragment>
</template>

<script lang="ts">
import PostFormPrivacyDialog from './PostFormPrivacyDialog.vue';
import PostFormMonetizationDialog from './PostFormMonetizationDialog.vue';
import PostFormAddLocationDialog from './PostFormAddLocationDialog.vue';
import AppEmojiPicker from './AppEmojiPicker.vue';
import PostFormTagUserListDialog from './PostFormTagUserListDialog.vue';
import PostFormPublicSquareDialog from './PostFormPublicSquareDialog.vue';
import {
  PostPrivacy,
  useCurrentUser,
  useFilePicker,
  useSnackbar,
  User,
  CreatePostBody,
  Monetized,
  PostType,
  useCreatePost,
  usePublicSquarePosting,
} from '~/composables';
import decodeHTMLEntities from '~/utils/decode-html-entities';

export default defineComponent({
  name: 'PostForm',
  components: {
    PostFormPrivacyDialog,
    PostFormMonetizationDialog,
    PostFormAddLocationDialog,
    AppEmojiPicker,
    PostFormTagUserListDialog,
    PostFormPublicSquareDialog,
  },
  setup() {
    const user = useCurrentUser();
    const text = ref('');
    const isMonetizationEnabled = ref(
      user.value?.paymentpointer ? Monetized.Yes : Monetized.No
    );
    const privacy = ref(PostPrivacy.Public);
    const location = ref('');
    const taggedFriends = ref<User[]>([]);
    const taggedFriendsUsernames = computed(() =>
      taggedFriends.value.map((i) => i.username).join(', ')
    );
    const { mutateAsync, isLoading } = useCreatePost();
    const createSnackbar = useSnackbar();
    const shouldPostToPublicSquare = ref(false);
    const postToPublicSquare = usePublicSquarePosting();

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
      location.value = '';
      clearPhoto();
    };

    const createPost = async () => {
      try {
        const body: CreatePostBody = {
          owner_guid: user.value?.guid!,
          poster_guid: user.value?.guid!,
          privacy: privacy.value,
          type: PostType.User,
          post: text.value,
          is_monetized: isMonetizationEnabled.value,
        };
        if (files.value.length) {
          body.ossn_photo = files.value[0];
        }
        if (location.value) {
          body.location = location.value;
        }
        if (taggedFriends.value.length) {
          body.friends = taggedFriends.value.map((i) => i.guid).join(',');
        }
        const createdPost = await mutateAsync(body);

        taggedFriends.value = [];

        if (shouldPostToPublicSquare.value) {
          createSnackbar('Posted successfully. Sending to Public Square...');
          const { result, success } = await postToPublicSquare.mutateAsync(
            decodeHTMLEntities(
              JSON.parse(createdPost.payload.post.description).post
            )
          );

          if (success && result) {
            window.location.href = result.next.always;
          } else {
            createSnackbar('An error occurred when posting to public square.');
          }
        } else {
          createSnackbar('Posted successfully');
          clearFields();
        }
      } catch (e) {
        createSnackbar('An error occurred');
      }
    };

    return {
      user,
      text,
      createPost,
      isLoading,
      openFileSelector,
      filesContent,
      clearPhoto,
      privacy,
      isMonetizationEnabled,
      location,
      taggedFriends,
      taggedFriendsUsernames,
      shouldPostToPublicSquare,
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

.post-photo-container {
  position: relative;
}
</style>
