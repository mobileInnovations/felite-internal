<template>
  <div class="tag-wrapper">
    <span class="tag"> Createdat: {{ formatDate(created) }} </span>
    <br>
    <span class="tag"> Modifiedat: {{ formatDate(updated) }} </span>
  </div>
</template>

<script setup>
import dayjs from "dayjs";

defineProps({
  created: { type: String, default: "" },
  updated: { type: String, default: "" },
});

const formatDate = (d) => (d ? dayjs(d).format("DD MMM YY HH:mm") : "-");
</script>

<style scoped>
.tag-wrapper {
  gap: 6px;
}
.tag {
  background: #f0f3f7;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.65rem;
  color: #444;
  border: 1px solid #dadde1;
}
</style>
