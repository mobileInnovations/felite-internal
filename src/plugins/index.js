import vuetify from "./vuetify";
import i18n from "./language";
import pinia from "@/stores";
import router from "@/router";

import { PerfectScrollbarPlugin } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/style.css";

import Vue3Lottie from "vue3-lottie";

import "@mdi/font/css/materialdesignicons.css";

export function registerPlugins(app) {
  app.use(vuetify);
  app.use(router);
  app.use(i18n);
  app.use(pinia);
  app.use(PerfectScrollbarPlugin);
  app.use(Vue3Lottie);
}
