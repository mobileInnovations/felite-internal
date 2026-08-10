<script>
import { shallowRef } from "vue";

import { useCustomizerStore } from "../../../stores/customizer";
import sidebarItems from "./sidebarItem";

import NavGroup from "./NavGroup/NavGroup.vue";
import NavItem from "./NavItem/NavItem.vue";
import NavCollapse from "./NavCollapse/NavCollapse.vue";

import { useAuthStore } from "@/stores/auth";
import { getIconTime } from "@/utils/formatHelp";

import pkj from "@/../package.json";

export default {
  components: {
    NavGroup,
    NavItem,
    NavCollapse,
  },
  setup() {
    const customizer = useCustomizerStore();
    const sidebarMenu = shallowRef(sidebarItems);

    const authStore = useAuthStore();

    // ❗ FIX: use multiple roles instead of single rolename
    const roles = authStore?.user?.roles ?? ["Guest"];
    const username = authStore?.user?.username || "Guest";

    const version = pkj.version;

    return {
      customizer,
      sidebarMenu,
      roles,
      username,
      version,
      getIconTime,
    };
  },
};
</script>

<template>
  <v-navigation-drawer
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    temporary
  >
    <div class="ma-4 d-flex align-center flex-wrap">
      <v-chip color="primary" variant="outlined" label size="small">
        <v-icon icon="mdi-account" start /> {{ username }}
      </v-chip>

      <v-spacer />

      <span class="text-subtitle-2 text-medium-emphasis"> is </span>

      <v-spacer />

      <!-- Show all roles -->
      <div class="d-flex flex-wrap gap-1">
        <v-chip
          v-for="(r, index) in roles"
          :key="index"
          color="primary"
          size="small"
        >
          {{ r }}
        </v-chip>
      </div>
    </div>

    <v-divider />

    <perfect-scrollbar class="scthrollnavbar">
      <v-list class="pa-4">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <NavGroup v-if="item.header" :item="item" />
          <v-divider v-else-if="item.divider" class="my-3" />
          <NavCollapse
            v-else-if="item.children"
            class="leftPadding"
            :item="item"
            :level="0"
          />
          <NavItem v-else :item="item" class="leftPadding" />
        </template>
      </v-list>

      <div class="pa-4 text-center">
        <v-chip color="inputBorder" size="small"> v{{ version }} </v-chip>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
