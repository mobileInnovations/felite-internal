import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

import router from "./router";

// Components
import App from "./App.vue";

// Styles
import "unfonts.css";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
