<template>
  <v-app>
    <!-- Show loading animation when loading -->
    <div v-if="loading" class="d-flex align-center justify-center fill-height">
      <v-card
        fluid
        variant="text"
        class="pa-8 d-flex align-center justify-center"
        style="width: 300px; height: 300px"
      >
        <Vue3Lottie :animation-data="animationData" loop autoplay />
      </v-card>
    </div>

    <!-- Show router content when done -->
    <router-view v-else :key="route.fullPath" />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import animationData from "@/assets/animations/loading.json";

const loading = ref(true);
const route = useRoute();

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1500);
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
