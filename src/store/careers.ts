import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState, CareersDataState } from '../types';
import { FETCH_JOB_POSTS } from './actions.names';
import axios from 'axios';
import { API_URL } from '../global';
import { SET_JOB_POSTS, SET_JOB_POSTS_ERRORS } from './mutations.names';

export const state: CareersDataState = {
  data: undefined,
  error: false,
};

const namespaced: boolean = false;

const getters: GetterTree<CareersDataState, RootState> = {
  jobPosts(state): any | undefined {
    return state.data;
  },
};

const actions: ActionTree<CareersDataState, RootState> = {
  [FETCH_JOB_POSTS]({ commit }, id: number): any {
    axios
      .get(
        `${API_URL}/pages/?child_of=${id}&type=home.JobPostPage&fields=location`,
      )
      .then(({ data }) => {
        commit(SET_JOB_POSTS, data.items);
      })
      .catch((err) => {
        commit(SET_JOB_POSTS_ERRORS);
      });
  },
};

const mutations: MutationTree<CareersDataState> = {
  [SET_JOB_POSTS](state, payload: any) {
    state.data = payload;
    state.error = false;
  },
  [SET_JOB_POSTS_ERRORS](state) {
    state.data = undefined;
    state.error = true;
  },
};

export const careersData: Module<CareersDataState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
