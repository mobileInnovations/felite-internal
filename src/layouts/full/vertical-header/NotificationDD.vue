<template>
  <div class="notification-container pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <h6 class="text-subtitle-1">
        {{ $t("all_notifications") }}
      </h6>
      <a
        href="#"
        class="text-decoration-underline text-primary text-subtitle-2"
        @click.prevent="onClickMarkAllRead"
      >
        {{ $t("mark_all_as_read") }}
      </a>
    </div>

    <v-divider />

    <!-- ✅ moved inline style to CSS -->
    <perfect-scrollbar class="notification-scroll">
      <v-list class="py-0" lines="three">
        <template v-if="loading">
          <v-list-item>
            <v-list-item-title>
              {{ $t("loading_notifications") }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-else-if="error">
          <v-list-item>
            <v-list-item-title class="text-error">
              {{ error }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-else-if="!filteredNotifications.length">
          <v-list-item>
            <v-list-item-title>
              {{ $t("no_notifications") }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item
            v-for="notif in filteredNotifications"
            :key="notif.notification_id"
            class="no-spacer"
            :class="notif.is_read ? 'bg-transparent' : 'bg-lightyellow'"
          >
            <template #prepend>
              <v-avatar size="40" class="mr-3 py-2">
                <component :is="getIconComponent(notif.type)" size="20" />
              </v-avatar>
            </template>

            <div class="d-inline-flex align-center justify-space-between w-100">
              <h6 class="text-subtitle-1 font-weight-medium">
                {{ currentLang === "en" ? notif.title_en : notif.title_th }}
              </h6>
              <span class="text-subtitle-2 text-medium-emphasis">
                {{ new Date(notif.notification_time).toLocaleString("th-TH") }}
              </span>
            </div>

            <p class="text-subtitle-2 text-medium-emphasis mt-1">
              {{ currentLang === "en" ? notif.message_en : notif.message_th }}
            </p>

            <div class="mt-2">
              <v-chip
                v-if="!notif.is_read"
                size="small"
                color="error"
                variant="tonal"
              >
                {{ $t("unread") }}
              </v-chip>
            </div>
          </v-list-item>
          <v-divider />
        </template>
      </v-list>
    </perfect-scrollbar>

    <v-divider />

    <div class="pa-2 text-center">
      <DialogAllNotifications
        :current-lang="currentLang"
        :notifications="props.notifications"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { BuildingStoreIcon, MailboxIcon, PhotoIcon } from "vue-tabler-icons";
// import { useNotificationStore } from "@/stores/notification.js";
import DialogAllNotifications from "./components/DialogAllNotifications.vue";

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  currentLang: { type: String, default: "en" },
});

const emit = defineEmits(["fect-noti"]);
// const notificationStore = useNotificationStore();

const selectNotify = ref("All Notifications");
const loading = ref(false);
const error = ref(null);
const hasMarkedInitial = ref(false);

// Computed: filtered notifications
const filteredNotifications = computed(() => {
  const all = props.notifications || [];
  let filtered = [];

  if (selectNotify.value === "Unread") filtered = all.filter((n) => !n.is_read);
  else if (selectNotify.value === "Read")
    filtered = all.filter((n) => n.is_read);
  else filtered = all;

  return filtered
    .slice()
    .sort(
      (a, b) => new Date(b.notification_time) - new Date(a.notification_time)
    );
});

const getIconComponent = (type) => {
  switch (type) {
    case "system":
      return BuildingStoreIcon;
    case "mail":
      return MailboxIcon;
    case "upload":
      return PhotoIcon;
    default:
      return null;
  }
};

const onClickMarkAllRead = () => {
  const notification_ids = filteredNotifications.value
    .filter((n) => !n.is_read)
    .map((n) => n.notification_id);
  if (!notification_ids.length) return;

  // notificationStore.read({ notification_ids });
  emit("fect-noti");
};

watch(
  () => filteredNotifications.value,
  (list) => {
    if (!hasMarkedInitial.value) {
      const unread = list.filter((n) => !n.is_read);
      if (unread.length > 0) {
        // const ids = unread.map((n) => n.notification_id);
        // notificationStore.read({ notification_ids: ids });
        emit("fect-noti");
        hasMarkedInitial.value = true;
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* ✅ moved inline style here */
.notification-scroll {
  height: calc(100vh - 300px);
  max-height: 650px;
}

/* Optional: soft highlight for unread notifications */
.bg-lightyellow {
  background-color: rgba(255, 235, 156, 0.3);
}

/* Better spacing consistency */
.notification-container {
  overflow: hidden;
}
</style>
