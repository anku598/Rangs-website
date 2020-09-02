import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState, PageDataState, pageDataType } from '../types';
import { FETCH_CURRENT_PAGE } from './actions.names';
import axios from 'axios';
import router from '@/router';
import { API_URL } from '../global';
import { SET_CURRENT_PAGE, CURRENT_PAGE_ERROR } from './mutations.names';

export const state: PageDataState = {
  data: undefined,
  error: false,
};

const namespaced: boolean = false;

const getters: GetterTree<PageDataState, RootState> = {
  pageData(state): pageDataType | undefined {
    return state.data;
  },

  pageType(state): string | null {
    if (!state.data) {
      return null;
    }
    const typeString = state.data.meta.type.split('.');
    return typeString[typeString.length - 1];
  },
};

const actions: ActionTree<PageDataState, RootState> = {
  [FETCH_CURRENT_PAGE]({ commit }, path: string = ''): any {
    path = path ? path : router.currentRoute.path;
    axios.get(`${API_URL}/pages/find/?html_path=${path}`).then(({ data }) => {
      axios
        .get(`${data.meta.detail_url}?fields=*`)
        .then(({ data }) => {
          commit(SET_CURRENT_PAGE, data);
        })
        .catch((err) => {
          commit(CURRENT_PAGE_ERROR);
        });
    });
  },
};

const mutations: MutationTree<PageDataState> = {
  [SET_CURRENT_PAGE](state, payload: pageDataType) {
    state.error = false;
    state.data = payload;
  },
  [CURRENT_PAGE_ERROR](state) {
    state.data = undefined;
    state.error = true;
  },
};

export const pageData: Module<PageDataState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
