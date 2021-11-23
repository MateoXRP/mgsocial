<template>
  <VRow>
    <VCol cols="12">
      <UserProfileHeader :username="$route.params.username" />
    </VCol>
    <VCol cols="12">
      <VTabs v-if="$accessor.auth.user" fixed-tabs>
        <VTab v-for="tab in tabs" :key="tab.name" :to="tab.route" exact>
          {{ tab.name }}
        </VTab>
      </VTabs>
    </VCol>
    <AppFragment
      v-if="
        $route.name &&
        ['u-username-index', 'u-username-index-public-square'].includes(
          $route.name
        )
      "
    >
      <VCol cols="12" md="8">
        <NuxtChild />
      </VCol>
      <VCol cols="12" md="4">
        <LatestFriendList title="Friends" />
      </VCol>
    </AppFragment>
    <VCol v-else cols="12"> <NuxtChild /></VCol>
  </VRow>
</template>

<script lang="ts">
import LatestFriendList from '~/components/LatestFriendList.vue';
import UserProfileHeader from '~/components/UserProfileHeader.vue';

export default defineComponent({
  components: {
    LatestFriendList,
    UserProfileHeader,
  },
  layout: 'authenticated',
  setup() {
    const route = useRoute();
    const username = route.value.params.username;
    useMeta({
      title: username,
    });
    const tabs = [
      { name: 'Timeline', route: `/u/${username}` },
      { name: 'Friends', route: `/u/${username}/friends` },
      { name: 'Photos', route: `/u/${username}/photos` },
      { name: 'Public Square', route: `/u/${username}/public-square` },
    ];

    return {
      tabs,
    };
  },
  head: {},
});
</script>
