<template>
  <v-container>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{}">
        <v-row>
          <v-col cols="12" class="btn-export-excel">
            <v-btn variant="tonal" color="secondary" @click="clickExportExcel">
              {{ label }}
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <v-card class="mx-auto" max-width="500" outlined>
        <v-list-item three-line>
          <v-list-item-title class="text-h5 mb-3 py-5">
            <v-icon icon="$fileExport" />
            {{ label }}
          </v-list-item-title>
          <v-row>
            <v-col cols="6">
              <DatePickUpComponent
                :label="$t('start_date')"
                :model-value="selectedStartDate"
                @update:model-value="selectedStartDate = $event"
              />
            </v-col>
            <v-col cols="6">
              <DatePickUpComponent
                :label="$t('end_date')"
                :model-value="selectedEndDate"
                @update:model-value="selectedEndDate = $event"
              />
            </v-col>
          </v-row>
        </v-list-item>

        <v-card-actions>
          <v-row>
            <v-col cols="6">
              <v-btn block variant="text" text @click="dialog = false">
                {{ $t("close") }}
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                variant="tonal"
                color="secondary"
                :loading="exporting"
                :disabled="!selectedStartDate || !selectedEndDate"
                block
                @click="exportReport"
              >
                {{ $t("export_excel") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import DatePickUpComponent from "@/components/shared/DatePickUpComponent.vue";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

defineProps({
  label: { type: String, default: "Export Report (.xlsx)" },
  isShow: { type: Boolean, default: false },
  date: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["export"]);

const dialog = ref(false);
const exporting = ref(false);

const selectedStartDate = ref(dayjs().startOf("month").format("YYYY-MM-DD"));
const selectedEndDate = ref(dayjs().format("YYYY-MM-DD"));

const clickExportExcel = () => {
  if (!selectedStartDate.value) {
    selectedStartDate.value = dayjs().format("YYYY-MM-DD");
  }
  if (!selectedEndDate.value) {
    selectedEndDate.value = dayjs().format("YYYY-MM-DD");
  }
  dialog.value = true;
};

const exportReport = async () => {
  const start = selectedStartDate.value;
  const end = selectedEndDate.value;

  if (!start || !end || !dayjs(start).isValid() || !dayjs(end).isValid()) {
    console.warn("Invalid date range");
    return;
  }

  if (dayjs(start).isAfter(dayjs(end))) {
    console.warn("Start date cannot be after end date");
    return;
  }

  exporting.value = true;

  emit("export", { startDate: start, endDate: end });

  dialog.value = false;
};

watch(
  () => selectedStartDate.value,
  (newVal) => {
    if (
      selectedEndDate.value &&
      dayjs(selectedEndDate.value).isBefore(dayjs(newVal), "day")
    ) {
      selectedEndDate.value = newVal;
    }
  }
);
</script>

<style scoped lang="scss">
.btn-export-excel {
  text-align: right;
}
</style>
