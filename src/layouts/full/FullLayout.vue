<script setup>
import { RouterView } from "vue-router";
import { useCustomizerStore } from "../../stores/customizer";

import VerticalSidebarVue from "./vertical-sidebar/VerticalSidebar.vue";
import VerticalHeaderVue from "./vertical-header/VerticalHeader.vue";
import FooterPanel from "@/layouts/full/footer/FooterPanel.vue";

const customizer = useCustomizerStore();
</script>

<template>
  <v-locale-provider>
    <v-app
      theme="PurpleTheme"
      :class="[
        customizer.fontTheme,
        customizer.mini_sidebar ? 'mini-sidebar' : '',
        customizer.inputBg ? 'inputWithbg' : '',
      ]"
    >
      <VerticalSidebarVue />
      <VerticalHeaderVue />
      <v-main>
        <v-container fluid class="page-wrapper">
          <div>
            <RouterView />
          </div>
        </v-container>
        <v-container fluid class="pt-0">
          <FooterPanel />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
