import { SiteSettingsState, RootState } from '../types';
import { GetterTree, ActionTree, MutationTree, Module } from 'vuex';
import { FETCH_ANALYTICS_SETTINGS } from './actions.names';
import axios from 'axios';
import { API_URL } from '@/global';
import {
  SET_ANALYTICS_SETTINGS,
  ANALYTICS_SETTINGS_ERROR,
} from './mutations.names';

export const state: SiteSettingsState = {
  analytics: undefined,
  analyticsError: false,
};

const namespaced: boolean = false;

const getters: GetterTree<SiteSettingsState, RootState> = {
  googleAnalyticsID(state: SiteSettingsState): string | null {
    if (state.analytics) {
      return state.analytics.google_analytics_id;
    } else {
      return null;
    }
  },
};

const actions: ActionTree<SiteSettingsState, RootState> = {
  async [FETCH_ANALYTICS_SETTINGS]({ commit }): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/others/settings/analytics/`)
        .then(({ data }) => {
          commit(SET_ANALYTICS_SETTINGS, data);
          resolve(data);
        })
        .catch((resp) => {
          commit(ANALYTICS_SETTINGS_ERROR);
          reject();
        });
    });
  },
};

const mutations: MutationTree<SiteSettingsState> = {
  [SET_ANALYTICS_SETTINGS](state, payload): void {
    state.analytics = payload;
    state.analyticsError = false;
  },
  [ANALYTICS_SETTINGS_ERROR](state) {
    state.analytics = undefined;
    state.analyticsError = true;
  },
};

export const siteSettings: Module<SiteSettingsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
