<template>
  <v-select
    v-model="selectedYear"
    :items="yearOptions"
    :label="$t('year')"
    variant="outlined"
    class="ma-2"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: new Date().getFullYear(),
  },
  range: {
    type: Number,
    default: 1,
  },
  future: {
    type: Boolean,
    default: false, // Allow future years?
  },
  thai: {
    type: Boolean,
    default: false, // Show year in Thai (Buddhist Era)
  },
});

const emit = defineEmits(["update:modelValue"]);

const currentYear = new Date().getFullYear();

const selectedYear = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    selectedYear.value = val;
  }
);

watch(selectedYear, (val) => {
  emit("update:modelValue", val);
});

const yearOptions = computed(() => {
  const start = currentYear - props.range;
  const end = props.future ? currentYear + props.range : currentYear;
  const years = [];
  for (let y = end; y >= start; y--) {
    years.push(props.thai ? { title: y + 543, value: y } : y);
  }
  return years;
});
</script>
