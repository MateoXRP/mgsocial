<template>
  <VMenu v-model="menu" bottom offset-y>
    <template #activator="{ on, attrs }">
      <VBtn color="accent" depressed v-bind="attrs" v-on="on">
        <VIcon>mdi-dots-horizontal</VIcon>
      </VBtn>
    </template>
    <VList v-if="userIsBlockedLoading" min-width="200">
      <VSkeletonLoader
        v-for="n in 3"
        :key="n"
        type="list-item"
      ></VSkeletonLoader>
    </VList>
    <VList v-else min-width="200">
      <VListItem @click="handleBlockUser">
        <VListItemTitle
          >{{
            isUserBlocked && isUserBlocked.payload ? 'Unblock' : 'Block'
          }}
          user</VListItemTitle
        >
      </VListItem>
    </VList>
  </VMenu>
</template>

<script lang="ts">
import {
  useDialog,
  useSnackbar,
  useCurrentUserId,
  useBlockUser,
  useUserIsBlocked,
  useFullscreenLoader,
} from '~/composables';

export default defineComponent({
  name: 'UserProfileHeaderMenu',
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const menu = ref(false);
    const { isLoading: userIsBlockedLoading, data: isUserBlocked } =
      useUserIsBlocked({
        isMenuOpen: menu,
        otherUserId: props.userId,
      });
    const blockUser = useBlockUser();
    const currentUserId = useCurrentUserId();
    const createConfirmDialog = useDialog();
    const createSnackbar = useSnackbar();
    const fullScreenLoader = useFullscreenLoader();

    const handleBlockUser = async () => {
      if (!isUserBlocked.value) return;

      const action = isUserBlocked.value.payload ? 'Unblock' : 'Block';

      try {
        const shouldProceed = await createConfirmDialog(
          'Confirm',
          `${action} user?`,
          { width: 300 }
        );
        if (shouldProceed) {
          fullScreenLoader.show();
          // await deletePostMutation.mutateAsync(props.postId);
          const result = await blockUser.mutateAsync({
            otherUserId: props.userId,
            action: action.toLowerCase() as 'block' | 'unblock',
          });

          if (result.payload) {
            createSnackbar(`User ${action.toLowerCase()}ed`);
          } else {
            createSnackbar(`Unable to ${action.toLowerCase()} user`);
          }

          fullScreenLoader.hide();
        }
      } catch (e) {
        createSnackbar(`Unable to ${action.toLowerCase()} user`);
      }
    };

    return {
      handleBlockUser,
      currentUserId,
      userIsBlockedLoading,
      isUserBlocked,
      menu,
    };
  },
});
</script>
