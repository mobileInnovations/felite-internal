<template>
  <div class="refresh-btn-container">
    <!-- Auto-refresh Toggle Version -->
    <v-row>
      <v-col cols="12">
        <v-btn
          :text="$t('refresh')"
          variant="tonal"
          prepend-icon="$refresh"
          :loading="loading"
          @click="handleRefresh"
        />
      </v-col>

      <v-col v-if="isShowAutoRefresh" cols="12">
        <v-switch
          v-model="autoRefresh"
          :label="$t('auto_refresh')"
          density="compact"
          inset
          hide-details
          color="primary"
          @update:model-value="toggleAutoRefresh"
        />
      </v-col>

      <v-col v-if="isShowAutoRefresh" cols="12">
        <v-select
          v-if="autoRefresh"
          v-model="refreshInterval"
          :items="intervalOptions"
          density="compact"
          variant="outlined"
          class="refresh-interval-select"
          hide-details
          @update:model-value="updateAutoRefresh"
        />
      </v-col>
    </v-row>
  </div>

  <v-snackbar
    v-model="snackbarInfo"
    timeout="10000"
    variant="tonal"
    :color="snackbarColor"
  >
    <div>{{ snackbarTextInfo }}</div>
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbarInfo = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";

const snackbarInfo = ref(false);
const snackbarTextInfo = ref("");
const snackbarColor = ref("");

// Snackbar helper
const showRefreshError = () => {
  snackbarInfo.value = true;
  snackbarTextInfo.value = "Failed to refresh data!";
  snackbarColor.value = "error";
};

// Props
const props = defineProps({
  refreshFunction: {
    type: Function,
    default: () => Promise.resolve(),
  },
  isShowAutoRefresh: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["refresh", "auto-refresh-change"]);

// Reactive state
const loading = ref(false);
const lastUpdated = ref(new Date());
const autoRefresh = ref(true);
const refreshInterval = ref(30);
const autoRefreshTimer = ref(null);

// Interval options
const intervalOptions = [30, 60, 300, 600].map((v) => ({
  title: v < 60 ? `${v}s` : `${v / 60}m`,
  value: v,
}));

// Methods
const handleRefresh = async (type = "all") => {
  if (loading.value) return;

  loading.value = true;
  try {
    emit("refresh", type);
    if (props.refreshFunction) await props.refreshFunction(type);
    lastUpdated.value = new Date();
  } catch (error) {
    console.error("Refresh failed:", error);
    showRefreshError();
  } finally {
    loading.value = false;
  }
};

const toggleAutoRefresh = (enabled) => {
  if (enabled) startAutoRefresh();
  else stopAutoRefresh();
  emit("auto-refresh-change", enabled);
};

let refreshDebounce;
const updateAutoRefresh = () => {
  if (refreshDebounce) clearTimeout(refreshDebounce);
  refreshDebounce = setTimeout(() => {
    if (autoRefresh.value) {
      stopAutoRefresh();
      startAutoRefresh();
    }
  }, 300);
};

const startAutoRefresh = () => {
  if (autoRefreshTimer.value) clearInterval(autoRefreshTimer.value);
  autoRefreshTimer.value = setInterval(() => {
    handleRefresh("auto");
  }, refreshInterval.value * 1000);
};

const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value);
    autoRefreshTimer.value = null;
  }
};

onUnmounted(() => stopAutoRefresh());

// Expose methods for parent use
defineExpose({
  refresh: handleRefresh,
  toggleAutoRefresh,
  loading: computed(() => loading.value),
});
</script>

<style scoped>
.refresh-btn-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/* extracted from inline */
.refresh-interval-select {
  max-width: 120px;
}

/* Icon spin animation */
.refresh-btn .v-icon {
  transition: transform 0.3s ease;
}

.refresh-btn.loading .v-icon {
  animation: spin 1s linear infinite;
}

.refresh-fab {
  border-radius: 50% !important;
}

.refresh-progress-container {
  width: 100%;
  max-width: 300px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Hover effects */
.v-btn:hover .v-icon {
  transform: rotate(180deg);
}

.v-btn.loading:hover .v-icon {
  transform: none;
}
</style>
