<template>
  <VNavigationDrawer v-model="drawer" app clipped left>
    <template #prepend>
      <div class="mt-2">
        <a href="/">
          <img alt="logo" src="/logo.png" />
        </a>
      </div>
    </template>
    <VTextField
      append-icon="mdi-magnify"
      class="mt-4 px-2"
      single-line
      hide-details
      placeholder="Search"
      outlined
      dense
    ></VTextField>

    <VListItem v-if="user" two-line class="px-2">
      <VListItemAvatar>
        <VImg :src="user.icon.small"></VImg>
      </VListItemAvatar>

      <VListItemContent>
        <VListItemTitle
          >{{ user.first_name }} {{ user.last_name }}</VListItemTitle
        >
        <VListItemSubtitle>Signed in with Coil</VListItemSubtitle>
      </VListItemContent>

      <VMenu v-model="menu" bottom left>
        <template #activator="{ on, attrs }">
          <VBtn icon v-bind="attrs" v-on="on">
            <VIcon>mdi-chevron-down</VIcon>
          </VBtn>
        </template>
        <VList>
          <VListItem nuxt to="/settings">
            <VListItemIcon>
              <VIcon>mdi-cog-outline</VIcon>
            </VListItemIcon>
            <VListItemContent>
              <VListItemTitle>Account Settings</VListItemTitle>
            </VListItemContent>
          </VListItem>
          <NewsFeedFilterDialog :menu.sync="menu" />
          <ThemeDialog :menu.sync="menu" />
          <VListItem @click="logout">
            <VListItemIcon>
              <VIcon>mdi-logout-variant</VIcon>
            </VListItemIcon>
            <VListItemContent>
              <VListItemTitle>Log Out</VListItemTitle>
            </VListItemContent>
          </VListItem>
        </VList>
      </VMenu>
    </VListItem>

    <VDivider />
    <VList nav dense>
      <VListItem
        v-for="item in links"
        :key="item.text"
        link
        :to="item.url"
        exact
      >
        <VListItemAction>
          <VIcon>{{ item.icon }}</VIcon>
        </VListItemAction>
        <VListItemContent>
          <VListItemTitle>
            {{ item.text }}
          </VListItemTitle>
        </VListItemContent>
        <VListItemIcon
          v-if="['Friends', 'Notifications', 'Messages'].includes(item.text)"
        >
          <VAvatar
            v-if="item.text === 'Friends' && friendsCount"
            color="red"
            size="25"
          >
            <span class="white--text" v-text="friendsCount"></span>
          </VAvatar>
          <VAvatar
            v-else-if="item.text === 'Notifications' && notificationsCount"
            color="red"
            size="25"
          >
            <span class="white--text" v-text="notificationsCount"></span>
          </VAvatar>
          <VAvatar
            v-else-if="item.text === 'Messages' && messagesCount"
            color="red"
            size="25"
          >
            <span class="white--text" v-text="messagesCount"></span>
          </VAvatar>
        </VListItemIcon>
      </VListItem>
    </VList>
    <template #append>
      <div class="text-caption pa-2">
        <NuxtLink class="nuxt-link" to="/site/about">About</NuxtLink>
        <span>·</span>
        <NuxtLink class="nuxt-link" to="/site/terms"
          >Terms and Conditions</NuxtLink
        >
        <span>·</span>
        <NuxtLink class="nuxt-link" to="/site/privacy">Privacy</NuxtLink>
        <span>·</span>
        <NuxtLink class="nuxt-link" to="/">© COPYRIGHT MG.SOCIAL</NuxtLink>
      </div></template
    >
  </VNavigationDrawer>
</template>

<script lang="ts">
import ThemeDialog from './ThemeDialog.vue';
import NewsFeedFilterDialog from './NewsFeedFilterDialog.vue';
import {
  useNotificationsCount,
  useCurrentUser,
  PostPrivacy,
} from '~/composables';

export default defineComponent({
  name: 'LeftNavigationDrawer',
  components: { ThemeDialog, NewsFeedFilterDialog },
  setup() {
    const drawer = ref(null);
    const menu = ref(false);
    const user = useCurrentUser();
    const {
      app: { $cookies, $accessor },
    } = useContext();
    const router = useRouter();
    const links = ref([
      { text: 'News Feed', icon: 'mdi-home-outline', url: '/home' },
      {
        text: 'Profile',
        icon: 'mdi-account-outline',
        url: `/u/${user.value?.username}`,
      },
      {
        text: 'Friends',
        icon: 'mdi-account-multiple-outline',
        url: `/u/${user.value?.username}/friends`,
      },
      {
        text: 'Notifications',
        icon: 'mdi-bell-outline',
        url: '/notifications',
      },
      { text: 'Messages', icon: 'mdi-email-outline', url: '/messages' },
      {
        text: 'Earnings',
        icon: 'mdi-currency-usd',
        url: '/earnings',
      },
    ]);
    const { friendsCount, notificationsCount, messagesCount } =
      useNotificationsCount();

    const logout = () => {
      $cookies.removeAll();
      $accessor.auth.setIsAuthenticated(false);
      $accessor.auth.setUser(null);
      $accessor.setNewsFeedFilter(PostPrivacy.Public);
      router.replace('/');
    };

    return {
      menu,
      drawer,
      links,
      user,
      logout,
      friendsCount,
      notificationsCount,
      messagesCount,
    };
  },
});
</script>

<style>
.logo {
  cursor: pointer;
}
</style>
