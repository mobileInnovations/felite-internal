<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        location="bottom"
        :offset="[0, 4]"
        :disabled="disabled"
      >
        <template #activator="{ props: menuProps }">
          <v-text-field
            v-model="localValue"
            :label="label"
            readonly
            v-bind="menuProps"
            :rules="[required]"
            required
            variant="outlined"
            :disabled="disabled"
          />
        </template>

        <v-date-picker
          :model-value="props.modelValue || undefined"
          :allowed-dates="allowedDates"
          @update:model-value="onDateSelect"
        />
      </v-menu>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  label: { type: String, default: "Date" },
  // allow String | null (and Date if you ever want)
  modelValue: { type: [String, Object, null], required: true },
  // ✅ simpler default: function(date) => boolean
  allowedDates: {
    type: Function,
    default: () => true,
  },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const menu = ref(false);
const localValue = ref("");

// format what you show in the text field
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      localValue.value = "";
      return;
    }

    const d = dayjs(val);
    localValue.value = d.isValid() ? d.format("DD MMM YYYY") : "";
  },
  { immediate: true }
);

const required = (v) => !!v || "Required";

// when user picks a date
function onDateSelect(date) {
  menu.value = false;

  if (!date) {
    emit("update:modelValue", null);
    return;
  }

  const selectedDate = dayjs(date).format("YYYY-MM-DD");
  emit("update:modelValue", selectedDate);
}
</script>
