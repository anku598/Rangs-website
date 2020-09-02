import { IndustriesState, RootState } from '../types';
import { GetterTree, ActionTree, MutationTree, Module } from 'vuex';
import { FETCH_INDUSTRIES_DATA } from './actions.names';
import { API_URL } from '../global';
import axios from 'axios';
import {
  SET_INDUSTRIES_DATA,
  INDUSTRIES_DATA_ERROR,
  SET_INDUSTRY_CURRENT_PAGE,
  SET_INDUSTRY_NEXT_ANIME,
  SET_INDUSTRY_PREV_ANIME,
} from './mutations.names';
import Vue from 'vue';
import {
  SET_INDUSTRY_PARENT_PAGE,
  SET_INDUSTRY_ANIMATION_LOCK,
} from './mutations.names';

export const state: IndustriesState = {
  data: {},
  parentPage: undefined,
  error: false,
  controllers: {
    currentPage: 0,
    beforeAnime: null,
    nextAnime: null,
    lock: false,
  },
};

const namespaced: boolean = false;

const getters: GetterTree<IndustriesState, RootState> = {
  industriesList(state) {
    if (!state) {
      return undefined;
    }
    return Object.values(state.data as any);
  },
  industryController(state) {
    return state.controllers;
  },
  industryParent(state) {
    return state.parentPage;
  },
  industryAnimationLock(state) {
    return state.controllers.lock;
  },
};

const actions: ActionTree<IndustriesState, RootState> = {
  async [FETCH_INDUSTRIES_DATA](
    { commit },
    data: { id: number; pageType: string },
  ): Promise<any> {
    let id = data.id;
    const pageType = data.pageType.split('.')[1];
    if (pageType !== 'IndustriesPage') {
      const transData = await axios.get(`${API_URL}/pages/${id}`);
      if (pageType == 'IndustryCategoryPage') {
        id = transData.data.meta.parent.id;
      } else {
        const parentData = await axios.get(
          `${API_URL}/pages/${transData.data.meta.parent.id}`,
        );
        id = parentData.data.meta.parent.id;
      }
    }
    axios.get(`${API_URL}/pages/${id}`).then(({ data }) => {
      commit(SET_INDUSTRY_PARENT_PAGE, data);
    });

    const url = `${API_URL}/pages/?child_of=${id}&type=home.IndustryCategoryPage&fields=*`;
    const pageResp = await axios.get(url);
    const pageData = await pageResp.data.items.map(
      async (page: any, idx: number) => {
        const concernResp = await axios.get(
          `${API_URL}/pages/?child_of=${page.id}&type=home.IndustryPage`,
        );
        if (page.menu_logo) {
          const rawSVG = await axios.get(
            page.menu_logo.meta.download_url.replace(
              'documents',
              'documents/view',
            ),
          );
          page.menu_logo.data = rawSVG.data;
        }
        page.concerns = concernResp.data.items;
        return page;
      },
    );
    Promise.all(pageData).then((comp: any) => {
      const data: any = {};
      comp.map((item: any) => {
        data[item.meta.slug as string] = item;
      });
      return new Promise((resolve, reject) => {
        commit(SET_INDUSTRIES_DATA, data);
        resolve();
      });
    });
  },
};

const mutations: MutationTree<IndustriesState> = {
  [SET_INDUSTRIES_DATA](state, payload): any {
    state.data = payload;
    state.error = false;
  },
  [INDUSTRIES_DATA_ERROR](state): any {
    state.data = {};
    state.error = true;
  },
  [SET_INDUSTRY_PARENT_PAGE](state, payload): any {
    state.parentPage = payload;
  },
  [SET_INDUSTRY_CURRENT_PAGE](state, idx: number | null): any {
    Vue.set(state.controllers, 'currentPage', idx);
  },
  [SET_INDUSTRY_NEXT_ANIME](state, idx: number | null): any {
    Vue.set(state.controllers, 'nextAnime', idx);
  },
  [SET_INDUSTRY_PREV_ANIME](state, idx: number | null): any {
    Vue.set(state.controllers, 'beforeAnime', idx);
  },
  [SET_INDUSTRY_ANIMATION_LOCK](state, val: boolean) {
    Vue.set(state.controllers, 'lock', val);
  },
};

export const industryData: Module<IndustriesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
