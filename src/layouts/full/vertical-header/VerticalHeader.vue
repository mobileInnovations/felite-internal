<script>
import { defineComponent, shallowRef, nextTick, ref, onUnmounted } from "vue";
import { SettingsIcon, Menu2Icon } from "vue-tabler-icons";
import { useCustomizerStore } from "../../../stores/customizer";
import { languages } from "@/utils/languages";
import router from "@/router";
import { getLang } from "@/utils/getStorage";

// dropdown imports
import ProfileDD from "./ProfileDD.vue";
// import NotificationDD from "./NotificationDD.vue";
import sidebarItems from "./sidebarItem";

// import { useAuthStore } from "@/stores/auth";
// import { useNotificationStore } from "@/stores/notification.js";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiBell, mdiTranslateVariant } from "@mdi/js";
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
    // const authStore = useAuthStore();
    // const notificationStore = useNotificationStore();
    const notificationCount = ref(0);

    // const userId = computed(() => authStore.user?.id);

    const notifications = ref([]);

    const currentLang = getLang();

    // Fetch notifications function
    // const fetchNotifications = async () => {
    //   try {
    //     const { data } = await notificationStore.getMessage({
    //       userId: userId.value,
    //       startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    //       endDate: dayjs().format("YYYY-MM-DD"),
    //     });

    //     const filterNotificationsUnread = data?.filter(
    //       (notification) => notification.is_read === false
    //     );
    //     notifications.value = data;
    //     notificationCount.value = filterNotificationsUnread?.length;
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    const sidebarMenu = shallowRef(sidebarItems);

    let intervalId = null;

    // onMounted(async () => {
    //   await fetchNotifications();
    //   intervalId = setInterval(fetchNotifications, 60000); // every 60 seconds
    // });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      customizer: useCustomizerStore(),
      currentLang,
      model: 0,
      languages: languages,
      mdiTranslateVariant: mdiTranslateVariant,
      mdiBell: mdiBell,
      notificationCount,
      sidebarMenu,
      notifications,
      // fetchNotifications,
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
        v-else
        class="hidden-md-and-down ms-3"
        variant="outlined"
        :append-icon="item.icon"
        @click="clickTo(item.to)"
      >
        {{ item.title }}
      </v-btn>
    </template>

    <v-spacer />

    <!-- ---------------------------------------------- -->
    <!-- Notification -->
    <!-- ---------------------------------------------- -->

    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn
          size="small"
          icon
          rounded="sm"
          variant="text"
          v-bind="props"
          stacked
        >
          <template v-if="notificationCount > 0">
            <v-badge
              color="error"
              :content="notificationCount"
              offset-x="4"
              offset-y="4"
            >
              <svg-icon type="mdi" :path="mdiBell" />
            </v-badge>
          </template>
          <template v-else>
            <svg-icon type="mdi" :path="mdiBell" />
          </template>
        </v-btn>
      </template>

      <!-- <v-sheet rounded="md" class="elevation-10">
        <NotificationDD
          :notifications="notifications"
          :current-lang="currentLang"
          @fect-noti="fetchNotifications"
        />
      </v-sheet> -->
    </v-menu>
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
