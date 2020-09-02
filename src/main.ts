import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vbclass from "vue-body-class";
import VueAnalytics from "vue-analytics";
import {
  FETCH_CURRENT_PAGE,
  FETCH_MAIN_MENU,
  FETCH_ANALYTICS_SETTINGS
} from "./store/actions.names";
import VeeValidate from "vee-validate";
import "./class-component-hooks";
import { SET_PAGE_IMAGE_LOADED } from "./store/mutations.names";
Vue.use(vbclass, router);
Vue.use(VeeValidate);

Vue.config.productionTip = false;
store.dispatch(FETCH_MAIN_MENU);
const gid: string | null = store.getters.googleAnalyticsID;
const isProd =
  process.env.NODE_ENV === "production" &&
  process.env.VUE_APP_DEVENV === "production";

store.dispatch(FETCH_ANALYTICS_SETTINGS).then(data => {
  if (data.google_analytics_id) {
    Vue.use(VueAnalytics, {
      id: data.google_analytics_id,
      router,
      debug: {
        enabled: !isProd,
        sendHitTask: isProd
      }
    });
  }
});

router.beforeEach((to: any, from: any, next: any) => {
  store.dispatch(FETCH_CURRENT_PAGE, to.path).then(() => {
    if (to.name && ["industries", "industry", "industryCategory", "industryMain"].indexOf(to.name) > -1) {
      store.commit(SET_PAGE_IMAGE_LOADED, true);
    } else {
      store.commit(SET_PAGE_IMAGE_LOADED, false);
    }
    next();
  });
});

new Vue({
  router,
  store,
  render: (h: any) => h(App)
}).$mount("#app");
