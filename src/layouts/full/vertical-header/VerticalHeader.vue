<script>
import { defineComponent, shallowRef, nextTick, ref, onUnmounted } from "vue";
import { SettingsIcon, Menu2Icon } from "vue-tabler-icons";
import router from "@/router";
import { useCustomizerStore } from "@/stores/customizer";
import { languages } from "@/utils/languages";
import { getLang } from "@/utils/getStorage";

// dropdown imports
import ProfileDD from "./ProfileDD.vue";
import sidebarItems from "./sidebarItem";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiTranslateVariant } from "@mdi/js";
import dayjs from "dayjs";

export default defineComponent({
  name: "VerticalHeader",
  components: {
    SvgIcon,
    SettingsIcon,
    Menu2Icon,
    ProfileDD,
  },

  data() {
    const currentLang = getLang();

    const sidebarMenu = shallowRef(sidebarItems);

    let intervalId = null;

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      customizer: useCustomizerStore(),
      currentLang,
      model: 0,
      languages: languages,
      mdiTranslateVariant: mdiTranslateVariant,
      sidebarMenu,
    };
  },

  methods: {
    switchLanguage(index) {
      if (index === 0) {
        this.$i18n.locale = "en";
      } else if (index === 1) {
        this.$i18n.locale = "th";
        dayjs.locale("th");
      }
      localStorage.setItem("LANG", this.$i18n.locale);
      location.reload();
    },
    clickTo(path) {
      nextTick(() => {
        router
          .push(path || "/")
          .then(() => console.log("Navigation done!"))
          .catch((err) => console.warn("Navigation error:", err));
      });
    },
  },
});
</script>

<template>
  <v-app-bar elevation="0" height="80" color="primary">
    <!-- Mobile Menu Button -->
    <v-btn
      class="hidden-lg-and-up text-primary ms-3"
      color="lightprimary"
      rounded="sm"
      size="small"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>

    <v-spacer />

    <!-- Navigation Buttons (Menu Items) -->
    <template v-for="(item, i) in sidebarMenu" :key="i">
      <!-- Case: Has children (dropdown menu) -->
      <v-menu v-if="item.children" offset-y>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="hidden-md-and-down ms-3"
            variant="outlined"
            :append-icon="item.icon"
          >
            {{ item.title }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(child, j) in item.children"
            :key="j"
            @click="clickTo(child.to)"
          >
            <v-list-item-title>
              <v-icon :icon="child.icon" start class="me-2" />
              {{ child.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Case: No children -->
      <v-btn
        v-else-if="item.title"
        class="hidden-md-and-down ms-3"
        variant="tonal"
        :append-icon="item.icon"
        @click="clickTo(item.to)"
      >
        {{ item.title }}
      </v-btn>

      <!-- Case is Homepage -->
      <v-btn
        v-if="!item.title"
        class="hidden-md-and-down ms-3"
        variant="tonal"
        :append-icon="item.icon"
        @click="clickTo(item.to)"
      >
        home
      </v-btn>
    </template>

    <v-spacer />

    <!-- ---------------------------------------------- -->
    <!-- Language -->
    <!-- ---------------------------------------------- -->

    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn size="small" icon rounded="sm" variant="text" v-bind="props">
          <svg-icon type="mdi" :path="mdiTranslateVariant" />
        </v-btn>
      </template>

      <v-sheet rounded="md" width="150" class="elevation-10">
        <v-list>
          <v-list-item
            v-for="(item, index) in languages"
            :key="index"
            @click="switchLanguage(index)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-menu>

    <!-- ---------------------------------------------- -->
    <!-- User Profile -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn
          class="profileBtn text-primary"
          color="lightprimary"
          variant="flat"
          rounded="pill"
          v-bind="props"
        >
          <SettingsIcon stroke-width="1.5" />
        </v-btn>
      </template>
      <v-sheet rounded="md" width="330" elevation="12">
        <ProfileDD />
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>
