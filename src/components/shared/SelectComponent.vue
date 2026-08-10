<template>
  <v-select
    v-model="selectedItems"
    :items="items"
    :item-title="$i18n.locale === 'th' ? 'th' : 'en'"
    item-value="value"
    :label="label"
    variant="outlined"
    density="compact"
    :multiple="multiple"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

useI18n();

const props = defineProps({
  modelValue: {
    type: [String, Array, null],
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: 'Label'
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedItems = ref(props.modelValue);

// keep local state in sync when parent changes
watch(
  () => props.modelValue,
  (val) => {
    selectedItems.value = val;
  }
);

// emit back to parent when local changes
watch(selectedItems, (val) => {
  emit('update:modelValue', val);
});
</script>
