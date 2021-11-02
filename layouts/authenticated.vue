<template>
  <VApp>
    <LeftNavigationDrawer />
    <RightNavigationDrawer />
    <VMain>
      <VContainer class="pa-4 pa-sm-6 pa-md-8" fluid tag="section">
        <VResponsive :max-width="960" class="mx-auto overflow-visible">
          <DialogProvider>
            <SnackbarProvider>
              <Nuxt />
            </SnackbarProvider>
          </DialogProvider>
        </VResponsive>
      </VContainer>
    </VMain>
    <VFooter padless>
      <VCol class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>&copy; MG.Social</strong>
      </VCol>
    </VFooter>
    <CoilTokensRefetcher />
    <Lightbox />
    <FullscreenLoader />
  </VApp>
</template>

<script lang="ts">
import { useNuxtQueryProvider } from 'vue-query/nuxt';
import LeftNavigationDrawer from '~/components/LeftNavigationDrawer.vue';
import RightNavigationDrawer from '~/components/RightNavigationDrawer.vue';
import SnackbarProvider from '~/components/SnackbarProvider.vue';
import DialogProvider from '~/components/DialogProvider.vue';

import getNextPageParam from '~/utils/get-next-page-param';
import { PostPrivacy, useCurrentUser, useThemeStorage } from '~/composables';
import CoilTokensRefetcher from '~/components/CoilTokensRefetcher.vue';
import Lightbox from '~/components/Lightbox.vue';
import FullscreenLoader from '~/components/FullscreenLoader.vue';

// TODO: Set logger in production
// setLogger({
//   log: () => {},
//   warn: () => {},
//   error: () => {},
// });

export default defineComponent({
  components: {
    LeftNavigationDrawer,
    RightNavigationDrawer,
    DialogProvider,
    SnackbarProvider,
    Lightbox,
    CoilTokensRefetcher,
    FullscreenLoader,
  },
  middleware: 'auth',
  setup() {
    useThemeStorage();
    const {
      app: { $accessor },
    } = useContext();
    const currentUser = useCurrentUser();
    const defaultOptions = reactive({
      queries: {
        getNextPageParam,
        enabled: computed(() => Boolean(currentUser.value)),
        retry: 2,
      },
    });

    onMounted(() => {
      $accessor.setNewsFeedFilter(
        (localStorage.getItem('mgsocial_newsfeed_filter') as PostPrivacy) ??
          PostPrivacy.Public
      );
    });

    useNuxtQueryProvider({
      defaultOptions,
    });

    return {};
  },
});
</script>

<style>
.nuxt-link {
  text-decoration: none;
  color: inherit !important;
}

.nuxt-link:hover {
  text-decoration: underline;
}

.hover-underline:hover {
  text-decoration: underline;
  cursor: pointer;
}

.hover:underline {
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
