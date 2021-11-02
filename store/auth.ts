import { mutationTree } from 'typed-vuex';
import { User } from '~/composables/useUserDetail';

interface CoilInfo {
  sub: string;
  email: string;
}

export const state = () => ({
  isAuthenticated: false,
  user: null as null | User,
  coilInfo: null as null | CoilInfo,
});

export const mutations = mutationTree(state, {
  setIsAuthenticated(state, payload: boolean) {
    state.isAuthenticated = payload;
  },
  setUser(state, payload: null | User) {
    state.user = payload;
  },
  setCoilInfo(state, payload: null | CoilInfo) {
    state.coilInfo = payload;
  },
});
