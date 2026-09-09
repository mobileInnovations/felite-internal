<template>
  <v-sheet
    v-if="value"
    class="pa-2 rounded-lg d-flex flex-column align-start"
    elevation="0"
  >
    <div class="d-flex align-center">
      <v-icon icon="mdi-calendar" size="12" class="me-1 text-primary" />
      <h5>{{ dayjs(value).format("DD MMM YY") }}</h5>
    </div>
    <div v-if="showTime" class="d-flex align-center mt-1">
      <v-icon icon="mdi-clock-outline" size="12" class="me-1 text-primary" />
      <span class="text-caption">{{ dayjs(value).format("HH:mm:ss") }}</span>
    </div>
  </v-sheet>
  <span v-else class="text-medium-emphasis">Not available</span>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/th";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const lang = localStorage.getItem("LANG") || "en";
dayjs.locale(lang);

const props = defineProps({
  value: {
    type: [String, Date, null],
    default: null,
  },
});

// Determine if the string includes a time portion
const showTime = computed(() => {
  if (!props.value) return false;
  const val =
    typeof props.value === "string"
      ? props.value
      : dayjs(props.value).format("YYYY-MM-DD HH:mm:ss");
  return /\d{2}:\d{2}:\d{2}/.test(val);
});
</script>

<style scoped>
.text-caption{
  font-size: 0.75rem;
  display: flex;
  line-height: 1rem;
}
</style>
