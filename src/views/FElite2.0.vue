<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <v-card class="pa-9" elevation="0">
    <TableComponent
      :headers="headers"
      :data="mergeData"
      :loading="loading"
      :error="error"
    />
  </v-card>
</template>

<script setup>
import { ref, shallowRef, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

import TableComponent from "@/components/shared/TableComponent.vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import { useFELiteStore } from "@/stores/felite";

const store = useFELiteStore();

const { mergeData, loading, error } = storeToRefs(store);

const { t } = useI18n();

const page = ref({ title: "FElite 2.0" });

const breadcrumbs = shallowRef([
  {
    title: page.value.title,
    disabled: true,
  },
]);

const headers = ref([
  { title: "No", key: "no" },
  { title: t("customer_name"), key: "customerName" },
  { title: t("serial_no"), key: "serialNo" },
  { title: t("imei_number"), key: "imeiNumber" },
  { title: t("unique_id"), key: "uid" },
  { title: t("unit_name"), key: "unitName" },
  { title: t("vehicle_make"), key: "vehicleMake" },
  { title: t("vehicle_model"), key: "vehicleModel" },
  { title: t("license_plate"), key: "licensePlate" },
  { title: t("equipment_type"), key: "equipmentType" },
  { title: t("phone_number"), key: "phoneNumber" },
  { title: t("last_position"), key: "lastPosition" },
  { title: t("last_gps_time"), key: "lastGpsTime" },
]);

onMounted(async () => {
  await store.loadData(2);
});
</script>
