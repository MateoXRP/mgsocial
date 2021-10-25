<template>
  <AppFragment>
    <VRow>
      <VCol cols="12" md="8">
        <template v-if="isLoading">
          <PostItemSkeleton />
        </template>
        <PostItem v-else :post="data" />
      </VCol>
      <VCol cols="12" md="4">
        <LatestFriendList />
        <LatestMemberList />
      </VCol>
    </VRow>
  </AppFragment>
</template>

<script lang="ts">
import PostItem from '~/components/PostItem.vue';
import { usePostDetail } from '~/composables';
import PostItemSkeleton from '~/components/PostItemSkeleton.vue';
import LatestMemberList from '~/components/LatestMemberList.vue';
import LatestFriendList from '~/components/LatestFriendList.vue';

export default defineComponent({
  components: {
    PostItem,
    PostItemSkeleton,
    LatestMemberList,
    LatestFriendList,
  },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const { data, isLoading } = usePostDetail(route.value.params.id);

    return {
      data,
      isLoading,
    };
  },
});
</script>
