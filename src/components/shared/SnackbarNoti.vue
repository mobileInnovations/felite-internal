<template>
  <v-snackbar
    v-model="snackbarInfo"
    :timeout="timeout"
    :color="snackbarColor"
  >
    <div class="text-body-2">{{ snackbarText }}</div>

    <template #actions>
      <v-btn variant="text" color="white" @click="snackbarInfo = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "Success!",
  },
  type: {
    type: String,
    default: "info", // info | success | error | warning
  },
  timeout: {
    type: Number,
    default: 4000,
  },
});

const snackbarInfo = ref(false);
const snackbarText = ref(props.text);
const snackbarColor = ref("");

// 🎨 Color mapping by type
const colorMap = {
  info: "info",
  success: "green",
  error: "red",
  warning: "orange",
};

// 🧭 Watch for prop changes
watch(
  () => props.type,
  (val) => {
    snackbarColor.value = colorMap[val] || "info";
  },
  { immediate: true }
);

watch(
  () => props.text,
  (val) => {
    snackbarText.value = val;
  }
);

// ✅ Expose a show() function so parent can trigger snackbar
function show(message = props.text, type = props.type) {
  snackbarText.value = message;
  snackbarColor.value = colorMap[type] || "info";
  snackbarInfo.value = true;
}

defineExpose({ show });
</script>

<style scoped>
.v-snackbar {
  font-weight: 500;
}
</style>
