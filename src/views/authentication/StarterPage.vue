<script setup>
import { onMounted, ref, nextTick, shallowRef } from "vue";
import { useI18n } from "vue-i18n";

import router from "@/router";

import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import sidebarItems from "@/layouts/full/vertical-sidebar/sidebarItem";

import { useAuthStore } from "@/stores/auth";

const { t } = useI18n();
const authStore = useAuthStore();

const role = authStore?.user?.rolename || "Guest";
const username = authStore?.user?.username || "Guest";

const page = ref({ title: t("home_page") });
const breadcrumbs = shallowRef([{ title: "", disabled: true, href: "#" }]);

const normalizeSidebarItems = (items) => {
  const result = [];
  items.forEach((item) => {
    if (item.children) {
      result.push(...item.children);
    } else {
      result.push(item);
    }
  });
  return result;
};

const normalizedSidebarItems = normalizeSidebarItems(sidebarItems);
const sidebarItemsSlice = normalizedSidebarItems.slice(2);

const clickTo = (path) => {
  nextTick(() => {
    router
      .push(path || "/")
      .then(() => console.log("Navigation done!"))
      .catch((err) => console.warn("Navigation error:", err));
  });
};

onMounted(async () => {});
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-card class="pa-9">
    <v-row>
      <v-col>
        {{ $t("hi") }}
        <v-chip variant="outlined" color="primary" label>
          <v-icon icon="mdi-account" start /> {{ username }}
        </v-chip>
        , {{ $t("welcome_back") }}
      </v-col>

      <v-col class="text-right">
        <v-chip variant="flat" color="primary"> {{ role }} </v-chip>
      </v-col>
    </v-row>

    <v-divider class="my-3" />
    <!------------------------------------->
    <!-- Card show all page to router -->
    <!------------------------------------->
    <v-item-group selected-class="bg-primary">
      <v-container>
        <v-row>
          <v-col
            v-for="(item, index) in sidebarItemsSlice"
            :key="index"
            cols="12"
            sm="3"
          >
            <v-item v-slot="{ selectedClass }">
              <v-card
                variant="tonal"
                color="primary"
                :class="[
                  'd-flex align-center justify-center text-center',
                  selectedClass,
                ]"
                height="100"
                @click="clickTo(item.to)"
              >
                <div class="text-h5 font-weight-bold">
                  {{ item.title }}
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </v-card>
</template>

<style lang="scss">
.container-btn-home {
  display: flex;
  justify-content: space-between;
}
</style>
