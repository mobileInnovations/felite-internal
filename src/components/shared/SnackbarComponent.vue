<template>
  <v-snackbar v-model="model" :multi-line="multiLine" :timeout="timeout">
    {{ text }}

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="closeSnackbar"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  text: {
    type: String,
    default: "",
  },
  timeout: {
    type: Number,
    default: 3000,
  },
  multiLine: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function closeSnackbar() {
  model.value = false;
}
</script>
