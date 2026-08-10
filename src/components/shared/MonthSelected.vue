<template>
  <v-select
    v-model="selectedMonth"
    :items="monthOptions"
    item-title="label"
    item-value="value"
    :label="$t('month')"
    variant="outlined"
    class="ma-2"
    @update:model-value="onMonthChange"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: new Date().getMonth() + 1,
  },
});

const lang = localStorage.getItem("LANG") || "en";
const emit = defineEmits(["update:modelValue"]);

const monthLabels = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  th: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ],
};

const monthOptions = computed(
  () =>
    monthLabels[lang]?.map((label, index) => ({
      label,
      value: index + 1,
    })) ?? []
);

const selectedMonth = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    selectedMonth.value = val;
  }
);

watch(selectedMonth, (val) => {
  emit("update:modelValue", val);
});

function onMonthChange(value) {
  selectedMonth.value = value;
}
</script>
