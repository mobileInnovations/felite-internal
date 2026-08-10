<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #default>
      <v-card class="pa-4">
        <h3 class="mb-4">{{ label }}</h3>
        <v-row>
          <!-- Search by Date -->
          <v-col cols="12" sm="6">
            <DatePickUpComponent
              :model-value="startDate"
              :label="$t('start_date')"
              type="startdate"
              @update:model-value="startDate = $event"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <DatePickUpComponent
              :model-value="endDate"
              :label="$t('end_date')"
              type="enddate"
              @update:model-value="endDate = $event"
            />
          </v-col>
          <v-col cols="4">
            <v-btn
              :text="t('close')"
              variant="tonal"
              block
              @click="closeDialog()"
            />
          </v-col>
          <v-col cols="8">
            <v-btn
              :text="confirmText"
              color="darkprimary"
              block
              @click="confirmSelection()"
            />
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import DatePickUpComponent from "./DatePickUpComponent.vue";

const { t } = useI18n();

const startDate = ref(null);
const endDate = ref(null);

const props = defineProps({
  dialog: { type: Boolean, required: true },
  label: { type: String, default: "" },
  confirmText: { type: String, default: "Confirm" },
});

const label = computed(() =>
  props.label ? props.label : t("select_date_range")
);

const emit = defineEmits(["update:dialog", "confirm"]);

const dialog = computed({
  get: () => props.dialog,
  set: (val) => emit("update:dialog", val),
});

const closeDialog = () => {
  emit("confirm", { startDate: null, endDate: null });
};

const confirmSelection = () => {
  emit("confirm", { startDate: startDate.value, endDate: endDate.value });
};
</script>
