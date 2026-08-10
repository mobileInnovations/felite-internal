<template>
  <div class="time-wrapper">
    <v-row class="time-input">
      <v-col cols="3" class="d-flex align-center">
        <v-text-field
          v-model.number="hours"
          label="Hours"
          type="number"
          min="0"
          :max="maxHours"
          density="compact"
          hide-details
          variant="outlined"
          :disabled="disabled"
          @input="updateTime"
        />
      </v-col>

      <v-col cols="3" class="d-flex align-center">
        <v-text-field
          v-model.number="minutes"
          label="Minutes"
          type="number"
          min="0"
          :max="maxMinutes"
          density="compact"
          hide-details
          variant="outlined"
          :disabled="disabled"
          @input="updateTime"
        />
      </v-col>

      <v-col cols="3">
        <v-text-field
          v-model.number="seconds"
          label="Seconds"
          type="number"
          min="0"
          :max="maxSeconds"
          density="compact"
          hide-details
          variant="outlined"
          :disabled="disabled"
          @input="updateTime"
        />
      </v-col>

      <v-col cols="3">
        <v-btn
          variant="tonal"
          class="d-flex align-right"
          :disabled="disabled"
          @click="getNow()"
        >
          {{ $t("now") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "00:00:00" },
  maxHours: { type: Number, default: 23 },
  maxMinutes: { type: Number, default: 59 },
  maxSeconds: { type: Number, default: 59 },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "update:parsed"]);

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const parseTime = (val) => {
  const timePart = val.includes(" ") ? val.split(" ")[1] : val;
  const [h = "0", m = "0", s = "0"] = timePart.split(":");

  hours.value = Math.min(props.maxHours, parseInt(h) || 0);
  minutes.value = Math.min(props.maxMinutes, parseInt(m) || 0);
  seconds.value = Math.min(props.maxSeconds, parseInt(s) || 0);
};

const pad = (n) => n.toString().padStart(2, "0");

const formatTime = () => {
  return `${pad(hours.value)}:${pad(minutes.value)}:${pad(seconds.value)}`;
};

const getNow = () => {
  const now = new Date();
  hours.value = now.getHours();
  minutes.value = now.getMinutes();
  seconds.value = now.getSeconds();
  updateTime();
};

const updateTime = () => {
  clampValues();
  emit("update:modelValue", formatTime());
  emit("update:parsed", {
    hours: hours.value,
    minutes: minutes.value,
    seconds: seconds.value,
  });
};

const clampValues = () => {
  hours.value = Math.max(0, Math.min(props.maxHours, hours.value));
  minutes.value = Math.max(0, Math.min(props.maxMinutes, minutes.value));
  seconds.value = Math.max(0, Math.min(props.maxSeconds, seconds.value));
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) parseTime(val);
  },
  { immediate: true }
);
</script>

<style scoped>
.time-wrapper {
  display: flex;
  justify-content: flex-start;
}

.time-input {
  display: flex;
  align-items: center;
}
</style>
