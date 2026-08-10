<template>
  <v-dialog v-model="dialog" scrollable max-width="500px">
    <template #activator="{ props: activatorProps }">
      <v-btn
        color="primary"
        variant="text"
        v-bind="activatorProps"
        class="position-relative"
      >
        {{ $t("view_all") }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ $t("notifications") }}</span>
        <v-btn icon variant="text" @click="dialog = false">
          <v-icon icon="$close" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- Filters Section -->
      <v-card-text class="pb-0">
        <v-row>
          <!-- Search Field -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="searchQuery"
              label="Search notifications"
              prepend-inner-icon="$magnify"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <!-- Read/Unread Filter -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="readFilter"
              :items="readFilterOptions"
              label="Status"
              prepend-inner-icon="$filter"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Date Range Filter -->
        <v-row>
          <v-col cols="12" sm="6">
            <DateInputComponent
              :model-value="startDate"
              :label="$t('start_date')"
              type="startdate"
              @update:model-value="startDate = $event"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <DateInputComponent
              :model-value="endDate"
              :label="$t('end_date')"
              type="enddate"
              @update:model-value="endDate = $event"
            />
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-row class="mt-2">
          <v-col cols="12" class="d-flex justify-space-between align-center">
            <div>
              <v-btn
                variant="text"
                size="small"
                :disabled="unreadCount === 0"
                @click="markAllAsRead"
              >
                {{ $t("mark_all_as_read") }}
              </v-btn>
              <v-btn
                variant="text"
                size="small"
                class="ml-2"
                @click="clearFilters"
              >
                {{ $t("clear_filters") }}
              </v-btn>
            </div>
            <v-chip size="small" variant="outlined">
              {{ filteredNotifications.length }} {{ $t("notifications") }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- ✅ Notifications List -->
      <v-card-text class="pa-0 notification-list">
        <v-list v-if="filteredNotifications.length > 0">
          <template
            v-for="(notification, index) in filteredNotifications"
            :key="notification.notification_id"
          >
            <v-list-item
              :class="{ 'bg-blue-lighten-5': !notification.is_read }"
              class="notification-item"
              @click="markAsRead(notification)"
            >
              <template #prepend>
                <v-avatar
                  :color="getNotificationColor(notification.type)"
                  size="40"
                >
                  <v-icon :icon="getNotificationIcon(notification.type)" />
                </v-avatar>
              </template>

              <v-list-item-title class="text-wrap mb-1">
                {{
                  currentLang === "en"
                    ? notification.title_en
                    : notification.title_th
                }}
                <v-chip
                  v-if="!notification.is_read"
                  size="x-small"
                  color="primary"
                  class="ml-2"
                >
                  {{ $t("new") }}
                </v-chip>
              </v-list-item-title>

              <v-list-item-subtitle class="text-wrap">
                {{
                  currentLang === "en"
                    ? notification.message_en
                    : notification.message_th
                }}
              </v-list-item-subtitle>

              <template #append>
                <div class="text-caption text-medium-emphasis text-right">
                  <div>
                    {{
                      dayjs(notification.notification_time).format(
                        "MMM D, YYYY",
                      )
                    }}
                  </div>
                  <div>{{ formatTime(notification.notification_time) }}</div>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    class="mt-1"
                    @click.stop="toggleReadStatus(notification)"
                  >
                    <v-icon
                      :icon="notification.is_read ? '$emailOpen' : '$email'"
                      size="16"
                    />
                  </v-btn>
                </div>
              </template>
            </v-list-item>

            <v-divider v-if="index < filteredNotifications.length - 1" />
          </template>
        </v-list>

        <!-- Empty State -->
        <div v-else class="text-center pa-8">
          <v-icon size="64" color="grey-lighten-2" icon="$bellOff" />
          <div class="text-h6 mt-4 text-medium-emphasis">
            {{ $t("no_notifications_found") }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ $t("try_adjusting_filters") }}
          </div>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-divider />
      <v-card-actions class="justify-center">
        <v-btn variant="text" :loading="loading" @click="loadMoreNotifications">
          {{ $t("load_more") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import DateInputComponent from "@/components/shared/DateInputComponent.vue";

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  currentLang: { type: String, default: "en" },
});

const emit = defineEmits(["mark-as-read", "mark-all-as-read", "load-more"]);

const dialog = ref(false);
const searchQuery = ref("");
const readFilter = ref(null);
const loading = ref(false);

const endDate = ref(dayjs().format("YYYY-MM-DD"));
const startDate = ref(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
const notifications = ref(props.notifications || []);

const readFilterOptions = [
  { title: "All", value: null },
  { title: "Read", value: true },
  { title: "Unread", value: false },
];

const unreadCount = computed(
  () => notifications.value.filter((n) => !n.is_read).length,
);

const filteredNotifications = computed(() => {
  let filtered = [...notifications.value];

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((n) =>
      [n.title_en, n.title_th, n.message_en, n.message_th]
        .map((f) => f.toLowerCase())
        .some((text) => text.includes(query)),
    );
  }

  // Read/Unread filter
  if (readFilter.value !== null) {
    filtered = filtered.filter((n) => n.is_read === readFilter.value);
  }

  // Sort
  return filtered.sort(
    (a, b) => new Date(b.notification_time) - new Date(a.notification_time),
  );
});

const getNotificationIcon = (type) =>
  ({
    system: "$cog",
    warning: "$alert",
    info: "$information",
    success: "$checkCircle",
    error: "$alertCircle",
  })[type] || "$bell";

const getNotificationColor = (type) =>
  ({
    system: "blue",
    warning: "orange",
    info: "cyan",
    success: "green",
    error: "red",
  })[type] || "grey";

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const markAsRead = (notification) => {
  if (!notification.is_read) {
    notification.is_read = true;
    emit("mark-as-read", notification);
  }
};

const toggleReadStatus = (notification) => {
  notification.is_read = !notification.is_read;
  emit("mark-as-read", notification);
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.is_read = true));
  emit("mark-all-as-read");
};

const clearFilters = () => {
  searchQuery.value = "";
  readFilter.value = null;
};

const loadMoreNotifications = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    emit("load-more");
  }, 1000);
};

watch(
  () => props.notifications,
  (newVal) => {
    if (newVal?.length) notifications.value = newVal;
  },
  { immediate: true },
);
</script>

<style scoped>
.notification-item {
  cursor: pointer;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.text-wrap {
  white-space: normal !important;
  word-wrap: break-word;
}

/* ✅ moved from inline style */
.notification-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
