import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

import router from "./router";

// Components
import App from "./App.vue";

// Styles
import "unfonts.css";
import 'vuetify/styles'
import "@/scss/style.scss";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
