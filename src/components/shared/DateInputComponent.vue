<template>
  <v-date-input
    :model-value="modelValue"
    :label="label"
    show-adjacent-months
    variant="outlined"
    clearable
    :allowed-dates="computedAllowedDates"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script>
import { allowedStartDates, allowedEndDates } from "@/utils/formatHelp";

export default {
  props: {
    label: { type: String, required: true },
    modelValue: {
      type: [Date, String, null],
      required: true,
    },
    allowedDates: {
      type: Function,
      default: () => () => true, // Allow all dates by default
    },
    type: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  computed: {
    dateValue() {
      return typeof this.modelValue === "string"
        ? new Date(this.modelValue)
        : this.modelValue;
    },
    computedAllowedDates() {
      if (this.type === "startdate") return allowedStartDates;
      if (this.type === "enddate") return allowedEndDates;
      return this.allowedDates;
    },
  },
};
</script>
