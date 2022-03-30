import Vue from "vue";

import "@/state/survey-state";
import App from "@/App.vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Icon, IconDefinition, library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserEdit,
  faUserTie,
  faCoins,
  faEnvelopeOpenText,
  faUsers,
  faChild,
  faPaperPlane,
  faBook
} from "@fortawesome/free-solid-svg-icons";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import routes from "@/routes";
import "./filters";

import "@/styles/index.scss";
import "bootstrap-vue/dist/bootstrap-vue.css";

// https://www.npmjs.com/package/vue-fontawesome-icon
// import material-icon scss
import "font-awesome/css/font-awesome.min.css";
import { SessionService } from "@/services/session-service";
import axios from "axios";

library.add(faUserTie as IconDefinition);
library.add(faUserEdit as IconDefinition);
library.add(faCoins as IconDefinition);
library.add(faEnvelopeOpenText as IconDefinition);
library.add(faUsers as IconDefinition);
library.add(faChild as IconDefinition);
library.add(faPaperPlane as IconDefinition);
library.add(faBook as IconDefinition);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);
Vue.use(VueCookies);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.directive('visible', function(el, binding) {
	el.style.visibility = !!binding.value ? 'visible' : 'hidden';
});

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.baseURL = `${process.env.BASE_URL}api/v1`;

const router = new VueRouter({
  routes: routes,
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

SessionService.redirectIfQuickExitCookie();

new Vue({
  router: router,
  render: h => h(App),
  data: {}
}).$mount("#app");
