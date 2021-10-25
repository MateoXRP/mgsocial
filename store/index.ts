import { getAccessorType, actionTree, mutationTree } from 'typed-vuex';
import { Context } from '@nuxt/types';

// Import all your submodules
import * as auth from './auth';
import { PostPrivacy } from '~/composables';

export const state = () => ({
  newsFeedFilter: PostPrivacy.Public,
  lightboxImageUrl: '',
  isLightboxOpen: false,
  isFullscreenLoaderOpen: false,
});

export const mutations = mutationTree(state, {
  setNewsFeedFilter(state, payload: PostPrivacy) {
    state.newsFeedFilter = payload;
  },
  setLightboxImageUrl(state, payload: string) {
    state.lightboxImageUrl = payload;
  },
  setIsLightboxOpen(state, payload: boolean) {
    state.isLightboxOpen = payload;
  },
  setIsFullscreenLoaderOpen(state, payload: boolean) {
    state.isFullscreenLoaderOpen = payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async nuxtServerInit(_vueContext, nuxtContext: Context): Promise<void> {
      const isAuthenticated = await nuxtContext.$authChecker();

      if (!isAuthenticated) {
        // nuxtContext.app.$cookies.removeAll();
        if (nuxtContext.route.path !== '/') {
          nuxtContext.app.router?.replace('/');
        }
      }
    },
  }
);

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    auth,
  },
});
