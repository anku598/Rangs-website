import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '../types';
import { pageData } from './pageData';
import { industryData } from './industryData';
import { animationData } from './animation';
import { menuData } from './menu';
import { careersData } from './careers';
import { siteSettings } from './settings';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: '0.1.0',
  },
  modules: {
    pageData,
    industryData,
    animationData,
    menuData,
    careersData,
    siteSettings,
  },
};

export default new Vuex.Store<RootState>(store);
