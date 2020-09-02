import Vue from 'vue';
import Router from 'vue-router';
import Page from './views/Page.vue';
import IndustryPageMain from './views/IndustryPageMain.vue';
import IndustryPage from './views/IndustryPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/industries*',
      name: 'industries',
      component: Page,
      children: [
        {
          path: '/industries/:category/:industry',
          name: 'industry',
          component: IndustryPage,
        },
        {
          path: '/industries/:category',
          component: IndustryPageMain,
          name: 'industryCategory',
        },
        {
          path: '',
          name: 'industryMain',
          component: IndustryPageMain,
        },
      ],
    },
    {
      path: '/*',
      name: 'pages',
      component: Page,
    },
  ],
  scrollBehavior(to: any, from: any, savedPosition: any) {
    return { x: 0, y: 0 };
  },
});
