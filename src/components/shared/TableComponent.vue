<template>
  <!-- 🔍 Date Filter Inputs -->
  <v-card elevation="0">
    <v-row class="search-box">
      <v-col cols="12">
        <h5>{{ $t("what_are_you_looking_for") }}</h5>
      </v-col>
      <!-- Search bar -->
      <v-col v-if="canSearch">
        <v-text-field
          v-model="search"
          :label="$t('search')"
          variant="outlined"
          hide-details="auto"
          color="secondary"
        />
      </v-col>
    </v-row>
  </v-card>

  <!-- Data table -->
  <v-card class="mt-10" elevation="0">
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="props.loading"
      loading-text="Loading... Please wait"
      :search="search"
      fixed-header
      fixed-footer
      @update:options="loadItems"
    >
      <template #loading>
        <div class="d-flex justify-center pa-6">
          <Vue3Lottie
            :animation-data="animationData"
            :height="200"
            :width="200"
            loop
            autoplay
          />
        </div>
      </template>
      <template #no-data>
        <div class="no-data-container">
          <div style="display: flex; flex-direction: column; gap: 6px">
            <Vue3Lottie
              :animation-data="noDataAnimation"
              loop
              autoplay
              :height="120"
              :width="120"
              style="flex-shrink: 0; margin: 0 !important; display: block"
            />
            <p style="font-size: 15px; font-weight: 500; margin: 0">
              No data available
            </p>
          </div>
        </div>
      </template>

      <template
        v-for="header in headers"
        :key="header.key"
        v-slot:[`item.${header.key}`]="{ item, index }"
      >
        <template v-if="header.editable">
          <v-text-field
            v-model="item[header.key]"
            variant="outlined"
            density="compact"
            hide-details
            @keyup.enter.exact="saveEdit(item, header.key)"
          />
        </template>

        <template v-else-if="header.highlight">
          <v-chip color="primary" label>
            {{ item[header.key] }}
          </v-chip>
        </template>

        <template v-else-if="header.key === 'action'">
          <v-btn density="compact" variant="text" icon="$circleEditOutline" />
        </template>

        <!-- Phone Number -->
        <template v-else-if="header.type === 'phone'">
          {{ formatPhoneNumber(item[header.key]) }}
        </template>

        <!-- Running Number -->
        <template v-else-if="header.key === 'no'">
          {{ (currentPage - 1) * itemsPerPage + index + 1 }}
        </template>

        <template v-else-if="!item[header.key]"> - </template>

        <template v-else-if="header.isTime">
          <div class="d-flex align-center mt-1">
            <v-icon icon="$clockOutline" size="12" class="me-1 text-primary" />
            <span class="text-caption">
              {{ dayjs(item[header.key]).format("HH:mm:ss") }}
            </span>
          </div>
        </template>

        <template v-else-if="header.type === 'date'">
          <DateTimeDisplay :value="item[header.key]" />
        </template>

        <template v-else-if="header.duration">
          <span v-if="item[header.key] === '-'">-</span>
          <span v-else class="timer">
            {{ formatDurationFromMinutes(item[header.key]) }}
          </span>
        </template>

        <template v-else-if="header.durationhr">
          <span v-if="item[header.key] === '-'">-</span>
          <span v-else class="timer">
            {{ formatDurationFromHours(item[header.key]) }}
          </span>
        </template>

        <template
          v-else-if="
            typeof item[header.key] === 'number' && !isNaN(item[header.key])
          "
        >
          {{ item[header.key].toLocaleString() }}
        </template>

        <template v-else>
          <span v-if="item[header.key] === 'null' || !item[header.key]">
            -
          </span>
          <span v-else>
            {{ item[header.key] }}
          </span>
        </template>
      </template>
    </v-data-table-server>
    <v-btn
      prepend-icon="mdi-refresh"
      :text="$t('refresh')"
      variant="tonal"
      @click="$emit('fetch-data', startDate, endDate)"
    />
  </v-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { debounce } from "lodash-es";
import dayjs from "dayjs";

import DateTimeDisplay from "./DateTimeDisplay.vue";
import noDataAnimation from "@/assets/animations/no-data.json";
import animationData from "@/assets/animations/loading.json";

import {
  formatDurationFromMinutes,
  formatDurationFromHours,
  formatPhoneNumber,
} from "@/utils/formatHelp.js";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array,
    default: () => [],
  },
  canSearch: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["fetch-data", "update"]);

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());

const serverItems = ref([]);
const dataIsLast7days = ref(false);
const search = ref("");

const endDate = ref(dayjs().format("YYYY-MM-DD"));
const startDate = ref(dayjs().subtract(30, "day").format("YYYY-MM-DD"));

const saveEdit = (item, key) => {
  console.log("item", item);
  console.log(
    "Saving",
    key,
    "with value",
    item[key],
    "for task no",
    item.taskNo,
  );
  emit("update", item, key);
};

const fetchTable = async ({ page, itemsPerPage, sortBy, items = [] }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // ✅ ไม่แก้ props.data โดยตรง
      let sortedItems = [...items];

      if (sortBy?.length) {
        const { key: sortKey, order } = sortBy[0];

        sortedItems.sort((a, b) => {
          const aVal = a[sortKey];
          const bVal = b[sortKey];

          if (aVal == null || aVal === "") return 1;
          if (bVal == null || bVal === "") return -1;

          const aString = String(aVal);
          const bString = String(bVal);

          const result = aString.localeCompare(bString, undefined, {
            numeric: true,
            sensitivity: "base",
          });

          return order === "desc" ? -result : result;
        });
      }

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      resolve({
        items: sortedItems.slice(start, end),
        total: sortedItems.length,
      });
    }, 0);
  });
};

// Main loader function
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  props.loading = true;
  currentPage.value = page;

  try {
    let filteredItems = [...props.data];

    if (search.value.trim()) {
      const query = search.value.trim().toLowerCase();

      filteredItems = filteredItems.filter((d) =>
        Object.values(d).some((field) =>
          String(field).toLowerCase().includes(query),
        ),
      );
    }

    const { items, total } = await fetchTable({
      page,
      itemsPerPage,
      sortBy,
      items: filteredItems,
    });

    serverItems.value = items;
    totalItems.value = total;
  } catch (err) {
    console.error("Error loading items:", err);
  } finally {
    props.loading = false;
  }
};

const formats = [
  "YYYY-MM-DD",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD HH:mm:ss.SSS",
];

const isDateLike = (value) => {
  return (
    typeof value === "string" &&
    formats.some((format) => dayjs(value, format, true).isValid())
  );
};

watch(
  search,
  debounce(() => {
    if (props.data.length === 0) return;
    loadItems({
      page: 1,
      itemsPerPage: itemsPerPage.value,
      sortBy: [],
    });
  }, 300),
);

watch([startDate, endDate], () => {
  if (startDate.value && endDate.value) {
    emit("fetch-data", startDate.value, endDate.value);
  }
  loadItems({
    page: 1,
    itemsPerPage: itemsPerPage.value,
    sortBy: [],
  });
});

watch(selectedMonth, () => {
  const month = selectedMonth.value;
  const year = selectedYear.value;

  dataIsLast7days.value = false;

  startDate.value = dayjs(`${year}-${month}-01`);
  endDate.value = startDate.value.endOf("month");
});

watch(selectedYear, () => {
  const month = selectedMonth.value;
  const year = selectedYear.value;

  dataIsLast7days.value = false;

  startDate.value = dayjs(`${year}-${month}-01`);
  endDate.value = startDate.value.endOf("month");
});

watch(
  () => props.data,
  () => {
    loadItems({
      page: 1,
      itemsPerPage: itemsPerPage.value,
      sortBy: [],
    });
  },
  { immediate: true },
);
</script>

<style lang="scss">
.text-appointment {
  font-size: 0.875rem;
  color: #444;
  font-weight: 500;
  line-height: 1.4;
}

.text-appointment .date {
  font-weight: 600;
  color: #222;
}

.text-appointment .time {
  font-size: 0.85rem;
  color: #666;
}

.table-wrapper {
  overflow-x: auto;
}

.timer {
  border-radius: 5px;
  font-family: monospace;
  color: #333;
}

.search-box {
  border-radius: 12px;
  background-color: white;
}

.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  padding: 40px 20px;
  text-align: left;
}
</style>
