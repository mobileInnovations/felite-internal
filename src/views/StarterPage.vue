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
        <v-chip
          v-for="(r, i) in roles"
          :key="i"
          variant="flat"
          color="primary"
          class="ma-1"
        >
          {{ r }}
        </v-chip>
      </v-col>
    </v-row>

    <v-divider class="my-3" />

    <v-container>
      <v-row>
        <v-col v-for="(item, index) in menuItems" :key="index" cols="12" sm="4">
          <v-card
            class="menu-card-glass"
            elevation="0"
            @click="item.children ? toggleExpand(index) : clickTo(item.to)"
          >
            <div class="icon-wrapper">
              <v-icon :icon="item.icon" size="80" />
            </div>

            <div class="menu-title">
              {{ item.title }}
            </div>

            <v-icon
              v-if="item.children"
              icon="$chevronDown"
              class="expand-icon"
              :class="{ rotate180: expanded[index] }"
            />
          </v-card>

          <!-- children -->
          <v-expand-transition>
            <div
              v-if="item.children && expanded[index]"
              class="children-wrapper"
            >
              <v-card
                v-for="(child, i) in item.children"
                :key="i"
                class="child-card"
                elevation="1"
                @click.stop="clickTo(child.to)"
              >
                <v-icon :icon="child.icon" size="18" class="mr-2" />
                {{ child.title }}
              </v-card>
            </div>
          </v-expand-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, nextTick, shallowRef, computed } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router";

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

<style scoped lang="scss">
.menu-card-glass {
  height: 150px;
  border-radius: 18px;
  padding: 24px;
  cursor: pointer;
  text-align: center;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.75);
  transition: 0.25s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
}

.icon-wrapper {
  background: #00ccff62;
  border-radius: 12px;
  padding: 10px;
  width: fit-content;
  margin: 0 auto 10px;
}

.menu-title {
  font-size: 1.05rem;
  font-weight: 600;
}

.expand-icon {
  position: absolute;
  bottom: 12px;
  right: 12px;
  transition: transform 0.25s ease;
}

.rotate180 {
  transform: rotate(180deg);
}

.children-wrapper {
  margin-top: 8px;
  padding-left: 6px;
}

.child-card {
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 6px;
  background: rgba(240, 240, 255, 0.8);
  display: flex;
  align-items: center;
  transition: 0.2s;

  &:hover {
    background: rgba(220, 220, 255, 1);
    transform: translateX(6px);
  }
}
</style>
