// ===============================|| ||==============Blank
Layout================= //
<template>
  <v-app>
    <v-container fluid class="fill-height d-flex align-center justify-center">
      <RouterView />
    </v-container>
  </v-app>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style lang="css" scoped></style>
