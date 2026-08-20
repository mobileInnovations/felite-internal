<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-card class="pa-9" elevation="0">
    <TableComponent :headers="headers" :data="mockData" />
  </v-card>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";

import TableComponent from "@/components/shared/TableComponent.vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import mockData from "@/demo/data.json";

const { t } = useI18n();

const page = ref({ title: t("home_page") });
const breadcrumbs = shallowRef([{ title: t("home_page"), disabled: true }]);

const headers = ref([
  { title: "No", key: "no" },
  { title: t("customer_name"), key: "customerName" },
  { title: t("serial_no"), key: "serialNo" },
  { title: t("imei_number"), key: "imeiNumber" },
  { title: t("unique_id"), key: "uniqueId" },
  { title: t("unit_name"), key: "unitName" },
  { title: t("vehicle_make"), key: "vehicleMake" },
  { title: t("vehicle_model"), key: "vehicleModel" },
  { title: t("license_plate"), key: "licensePlate" },
  { title: t("equipment_type"), key: "equipmentType" },
  { title: t("phone_number"), key: "phoneNumber" },
  { title: t("last_position"), key: "lastPosition" },
  { title: t("last_gps_time"), key: "lastGpsTime" },
  { title: t("actions"), key: "actions", sortable: false },
]);
</script>

<style scoped lang="scss"></style>
