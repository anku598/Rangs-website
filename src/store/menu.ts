import { MenuState, RootState, MainMenuItem } from '../types';
import { GetterTree, ActionTree, MutationTree, Module } from 'vuex';
import { FETCH_MAIN_MENU } from './actions.names';
import { API_URL } from '../global';
import { SET_MAIN_MENU, SET_MAIN_MENU_ERROR } from './mutations.names';
import axios from 'axios';

export const state: MenuState = {
  mainMenu: [],
  mainMenuError: false,
};

const namespaced: boolean = false;

const getters: GetterTree<MenuState, RootState> = {
  mainMenu(state): MainMenuItem[] {
    return state.mainMenu;
  },
};

const actions: ActionTree<MenuState, RootState> = {
  [FETCH_MAIN_MENU]({ commit }): any {
    axios
      .get(`${API_URL}/others/menu/`)
      .then(({ data }) => {
        commit(SET_MAIN_MENU, data);
      })
      .catch((err) => {
        commit(SET_MAIN_MENU_ERROR);
      });
  },
};

const mutations: MutationTree<MenuState> = {
  [SET_MAIN_MENU](state, payload: MainMenuItem[]): any {
    state.mainMenuError = false;
    state.mainMenu = payload;
  },
  [SET_MAIN_MENU_ERROR](state): any {
    state.mainMenu = [];
    state.mainMenuError = true;
  },
};

export const menuData: Module<MenuState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
