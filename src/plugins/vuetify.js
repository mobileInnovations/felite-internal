import "vuetify/styles";
import { createVuetify } from "vuetify";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

import { icons } from "./mdi-icon";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { LightTheme } from "@/theme/LightTheme";
import { en } from "vuetify/locale";

const vuetify = createVuetify({
  locale: {
    global: {
      font: {
        family: "Roboto",
      },
    },
    locale: "en-CA",
    fallback: "en",
    messages: {
      "en-CA": {
        ...en,
        close: "Close",
        displayName: {
          close: "Close",
        },
      },
    },
  },
  components: {
    ...components,
  },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
      ...icons,
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "LightTheme",
    themes: {
      LightTheme,
    },
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: "md",
    },
    VTextField: {
      rounded: "lg",
    },
    VTooltip: {
      location: "top", // Set v-tooltip default location to top
    },
  },
});

export default vuetify;
