<template>
  <div class="d-flex">
    <span class="text-id" @click="copyToClipboard(id)">{{ id }}</span>
    <v-btn
      size="x-small"
      icon="$contentCopy"
      variant="text"
      @click="copyToClipboard(id)"
    />
  </div>

  <SnackbarNoti ref="snackbar" />
</template>

<script setup>
import { ref } from "vue";
import SnackbarNoti from "./SnackbarNoti.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  id: {
    type: String,
    default: "",
  },
});

const snackbar = ref();

const copyToClipboard = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    snackbar.value.show(t("copied-to-clipboard"), "success");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
</script>

<style>
.text-id {
  font-family: "Courier New", Courier, monospace;
  color: gray;
  font-size: smaller;
  display: flex;
  align-items: center;
}
</style>
