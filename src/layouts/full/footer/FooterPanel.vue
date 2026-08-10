<script setup>
const version = import.meta.env.VITE_VERSION;
const lastUpdated = import.meta.env.VITE_LAST_UPDATED;
</script>

<template>
  <v-divider />

  <v-footer
    app
    class="footer px-6 py-3 d-flex align-center justify-space-between flex-wrap"
  >
    <!-- Left section -->
    <div class="footer-left d-flex align-center">
      <span class="text-body-1 font-weight-medium">Mobile Innovation</span>
    </div>

    <!-- Center section -->
    <div class="footer-center text-center my-1 my-sm-0">
      <span class="font-weight-medium text-body-2">Activa</span>
    </div>

    <!-- Right section -->
    <div class="footer-right d-flex align-center flex-wrap justify-end">
      <v-chip label color="secondary" size="small" class="mx-1">
        v{{ version }}
      </v-chip>
      <span class="text-caption text-medium-emphasis">
        last updated: {{ lastUpdated }}
      </span>
    </div>
  </v-footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-border-color), 0.2);
  font-family: "Roboto", sans-serif;
  color: rgba(var(--v-theme-on-surface), 0.87);

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;

    .footer-left,
    .footer-center,
    .footer-right {
      justify-content: center;
      width: 100%;
      margin: 2px 0;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
}
</style>
