<template>
  <VRow>
    <VCol cols="12">
      <UserProfileHeader :username="$route.params.username" />
    </VCol>
    <VCol cols="12">
      <VTabs fixed-tabs>
        <VTab v-for="(tab, index) in tabs" :key="index" :to="tab.route" exact>
          {{ tab.name }}
        </VTab>
      </VTabs>
    </VCol>
    <AppFragment v-if="$route.name === 'u-username-index'">
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
    const tabs = ref([
      { name: 'Timeline', route: `/u/${username}` },
      { name: 'Friends', route: `/u/${username}/friends` },
      { name: 'Bio', route: `/u/${username}/bio` },
      { name: 'Photos', route: `/u/${username}/photos` },
    ]);

    return {
      tabs,
    };
  },
  head: {},
});
</script>
