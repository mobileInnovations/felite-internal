<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-card class="pa-9"> 
    <TableComponent/>
  </v-card>
</template>

<script setup>
import { ref, nextTick, shallowRef, computed } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router";

import TableComponent from "@/components/shared/TableComponent.vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import sidebarItems from "@/layouts/full/vertical-sidebar/sidebarItem";
import { useAuthStore } from "@/stores/auth";

const { t } = useI18n();
const authStore = useAuthStore();

// MULTIPLE ROLES
const roles = authStore?.user?.roles ?? ["Guest"];
const username = authStore?.user?.username ?? "Guest";

const page = ref({ title: t("home_page") });
const breadcrumbs = shallowRef([{ title: t("home_page"), disabled: true }]);

const expanded = ref({});

const toggleExpand = (idx) => {
  expanded.value[idx] = !expanded.value[idx];
};

// FILTER MENUS BASED ON MULTIPLE ROLES
const menuItems = computed(() => {
  return sidebarItems
    .filter((item) => {
      // Check parent permissions
      if (
        item.permissions &&
        !item.permissions.some((p) => roles.includes(p))
      ) {
        return false;
      }
      if (!item.title) return false;
      if (item.title === "Home Page") return false;
      return true;
    })
    .map((item) => {
      if (item.children) {
        const children = item.children.filter(
          (c) => !c.permissions || c.permissions.some((p) => roles.includes(p)),
        );
        return { ...item, children };
      }
      return item;
    });
});

// navigation
const clickTo = (path) => {
  nextTick(() => {
    router
      .push(path || "/")
      .then(() => console.log("Navigation done!"))
      .catch((err) => console.warn("Navigation error:", err));
  });
};
</script>

<style scoped lang="scss"></style>
