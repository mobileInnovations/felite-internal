<template>
  <v-container fluid class="no-max-width">
    <v-dialog v-model="dialog" max-width="500">
      <template #activator="{ props: btnProps }">
        <DateTimeDisplay :value="modelValue" />
        <v-btn v-bind="btnProps" color="primary" variant="tonal">
          {{ label }}
        </v-btn>
      </template>

      <template v-slot:default="{}">
        <v-card class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-title class="text-h4 mb-3 py-5">
              {{ label }}
            </v-list-item-title>

            <DateInputComponent
              :model-value="selectedDate"
              :label="$t('date')"
              @update:model-value="selectedDate = $event"
            />
            <TimePickUpComponent
              :model-value="selectedTime"
              @update:model-value="selectedTime = $event"
            />
          </v-list-item>

          <v-card-actions>
            <v-btn variant="tonal" @click="dialog = false">
              {{ $t("close") }}
            </v-btn>
            <v-btn
              variant="tonal"
              color="primary"
              :disabled="!selectedDate || !selectedTime"
              @click="handleConfirm()"
            >
              {{ $t("confirm") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";

import DateInputComponent from "@/components/shared/DateInputComponent.vue";

import DateTimeDisplay from "./DateTimeDisplay.vue";
import TimePickUpComponent from "./TimePickUpComponent.vue";

import dayjs from "dayjs";

// Props
const props = defineProps({
  label: {
    type: String,
    default: "Date Time",
  },
  modelValue: {
    type: Object,
    required: true,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "handleConfirm"]);

// Local state
const dialog = ref(false);
const selectedDate = ref(new Date());
const selectedTime = ref("");

// Handle
const handleConfirm = async () => {
  emit("update:modelValue", {
    date: selectedDate.value,
    time: selectedTime.value,
  });
  console.log("handleConfirm item", props.item);
  emit("handleConfirm", {
    item: props.item,
    date: selectedDate.value,
    time: selectedTime.value,
  });
  dialog.value = false;
};

// Watch
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;

    if (typeof newVal === "string") {
      // Parse with dayjs
      const d = dayjs(newVal);
      if (d.isValid()) {
        selectedDate.value = d.toDate();
        selectedTime.value = d.format("HH:mm:ss");
      }
    } else if (typeof newVal === "object") {
      // Object with { date, time }
      if (newVal.date) {
        const d = dayjs(newVal.date);
        if (d.isValid()) selectedDate.value = d.toDate();
      }
      if (newVal.time) selectedTime.value = newVal.time;
    }
  },
  { immediate: true }
);
</script>
