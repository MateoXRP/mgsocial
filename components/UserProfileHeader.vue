<template>
  <VCard height="405px" style="position: relative">
    <template v-if="user">
      <ProfileHeaderCover
        :user-id="user.guid"
        :username="username"
        :cover-photo-url="user.cover_url"
      />
      <div class="user-detail">
        <ProfileHeaderPhoto
          :user-id="user.guid"
          :username="username"
          :profile-photo-url="user.icon.larger"
        />
        <div class="profile-detail my-2">
          <div class="text-h5">{{ user.username }}</div>
        </div>
        <div v-if="currentUserId !== user.guid" class="mb-4">
          <VBtn
            v-if="isFriendByCurrentUser"
            :loading="isLoading"
            :disabled="isLoading"
            color="accent"
            depressed
            @click="declineRequest"
            >Unfriend</VBtn
          >
          <template v-else-if="requestExists">
            <VBtn
              v-if="isAddedByCurrentUser"
              :loading="isLoading"
              :disabled="isLoading"
              color="accent"
              depressed
              @click="declineRequest"
              >Request Sent</VBtn
            >
            <VBtn
              v-else
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              depressed
              @click="addOrAcceptRequest('accept')"
              >Confirm</VBtn
            >
          </template>
          <VBtn
            v-else
            :loading="isLoading"
            :disabled="isLoading"
            color="primary"
            depressed
            @click="addOrAcceptRequest('add')"
            >Add Friend</VBtn
          >
        </div>
        <VBtn v-else class="mb-4" color="primary" outlined to="/settings"
          >Edit Profile</VBtn
        >
      </div>
    </template>
  </VCard>
</template>

<script lang="ts">
import ProfileHeaderPhoto from './ProfileHeaderPhoto.vue';
import ProfileHeaderCover from './ProfileHeaderCover.vue';
import {
  useCurrentUserId,
  useUserDetail,
  useUserIsFriend,
  useCreateFriendRequest,
  useRemoveFriend,
  useSnackbar,
} from '~/composables';

export default defineComponent({
  name: 'UserProfileHeader',
  components: { ProfileHeaderPhoto, ProfileHeaderCover },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { data: user } = useUserDetail(props.username);
    const friendRequest = useCreateFriendRequest();
    const showSnackbar = useSnackbar();
    const removeFriend = useRemoveFriend();
    const currentUserId = useCurrentUserId();
    const otherUser = computed(() =>
      user.value ? user.value.guid : undefined
    );

    const { data: viewedUser } = useUserIsFriend({
      currentUser: currentUserId,
      otherUser,
    });

    const isFriendByCurrentUser = computed(
      () => viewedUser.value?.payload.is_friend
    );
    const requestExists = computed(
      () => viewedUser.value?.payload.request_exists
    );
    const isAddedByCurrentUser = computed(
      () => viewedUser.value?.payload.added_by_guid === currentUserId.value
    );

    const isLoading = computed(
      () => friendRequest.isLoading.value || removeFriend.isLoading.value
    );

    const declineRequest = async () => {
      try {
        await removeFriend.mutateAsync(user.value?.guid!);
        showSnackbar('Friend request removed');
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

    const addOrAcceptRequest = async (action: 'accept' | 'add') => {
      try {
        await friendRequest.mutateAsync({
          userId: user.value?.guid!,
          action,
        });
        if (action === 'add') {
          showSnackbar('Friend request sent');
        } else {
          showSnackbar('Friend request accepted');
        }
      } catch (e) {
        showSnackbar('An error occurred');
      }
    };

    return {
      user,
      currentUserId,
      requestExists,
      isFriendByCurrentUser,
      isAddedByCurrentUser,
      isLoading,
      declineRequest,
      addOrAcceptRequest,
    };
  },
});
</script>

<style>
.user-detail {
  /* z-index: 2; */
  text-align: center;
  position: absolute !important;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
