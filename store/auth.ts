import { mutationTree } from 'typed-vuex';
import { User } from '~/composables/useUserDetail';

export const state = () => ({
  isAuthenticated: false,
  user: null as null | User,
});

export const mutations = mutationTree(state, {
  setIsAuthenticated(state, payload: boolean) {
    state.isAuthenticated = payload;
  },
  setUser(state, payload: null | User) {
    state.user = payload;
  },
});
