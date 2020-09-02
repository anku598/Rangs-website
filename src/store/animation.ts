import { TimelineMax } from "gsap";
import { AnimationState, RootState } from "../types";
import { GetterTree, ActionTree, MutationTree, Module } from "vuex";
import { SET_PAGE_IMAGE_LOADED } from "./mutations.names";
import {
  ADD_ANIMATION,
  SET_MENU_LOADED,
  SET_PRELOADER_LOADED
} from "./mutations.names";

export const state: AnimationState = {
  mainTimeLine: new TimelineMax({}),
  menuLoaded: false,
  preloaderLoaded: false,
  pageImageLoaded: false
};

const namespaced: boolean = false;

const getters: GetterTree<AnimationState, RootState> = {
  mainTimeLine(state): any {
    return state.mainTimeLine;
  },
  mainTimeLineIsFinished(state) {
    return state.mainTimeLine.progress() == 1;
  },
  isMenuLoaded(state) {
    return state.menuLoaded;
  },
  isPreloaderLoaded(state) {
    return state.preloaderLoaded;
  },
  isPageImageLoaded(state) {
    return state.pageImageLoaded;
  }
};

const actions: ActionTree<AnimationState, RootState> = {};

const mutations: MutationTree<AnimationState> = {
  [ADD_ANIMATION](state, ...animeData: any[]) {
    state.mainTimeLine.add(...animeData);
  },
  [SET_MENU_LOADED](state, val: boolean) {
    state.menuLoaded = val;
  },
  [SET_PRELOADER_LOADED](state, val: boolean) {
    state.preloaderLoaded = val;
  },
  [SET_PAGE_IMAGE_LOADED](state, val: boolean) {
    console.log(val);
    state.pageImageLoaded = val;
  }
};

export const animationData: Module<AnimationState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
