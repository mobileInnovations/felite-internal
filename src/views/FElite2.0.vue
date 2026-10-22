<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <v-card class="pa-9" elevation="0">
    <div class="btn-export-csv">
      <v-btn color="green" variant="flat" @click="store.exportToCSV()">
        Export CSV
      </v-btn>
    </div>

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
  { title: t("customer_name"), key: "customerName", minWidth: 200 },
  { title: t("serial_no"), key: "serialNo", minWidth: 150 },
  { title: t("unique_id"), key: "uniqueId", minWidth: 150 },
  { title: t("unit_name"), key: "unitName", minWidth: 150 },
  { title: t("license_plate"), key: "licensePlate", minWidth: 150 },
  { title: t("equipment_type"), key: "equipmentType", minWidth: 150 },
  {
    title: t("phone_number"),
    key: "phoneNumber",
    type: "phone",
    minWidth: 150,
  },
  { title: t("last_position"), key: "lastPosition", minWidth: 150 },
  {
    title: t("last_gps_time"),
    key: "lastGpsTime",
    type: "date",
    minWidth: 150,
  },
]);

onMounted(async () => {
  await store.loadData(2);
});
</script>

<style scoped>
.btn-export-csv {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
