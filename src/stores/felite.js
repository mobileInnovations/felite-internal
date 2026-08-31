import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

const apiBaseUrl = "/wialon-api/wialon/ajax.html";

export const useFELiteStore = defineStore("felite", () => {
  const eid = ref("");
  const units = ref([]);
  const types = ref([]);
  const customers = ref([]);

  const loading = ref(false);
  const error = ref(null);

  // ==============================
  // Get All Hardware Types
  // PHP: getAllType($eid)
  // ==============================
  async function getAllType(sessionId) {
    try {
      const params = {
        filterType: "*",
        filterValue: "*",
        includeType: true,
        ignoreRename: true,
      };

      const response = await fetchWrapper.get(
        `${apiBaseUrl}?svc=core/get_hw_types&sid=${sessionId}&params=${encodeURIComponent(
          JSON.stringify(params),
        )}`,
      );

      types.value = response;

      return response;
    } catch (err) {
      console.error("getAllType error:", err);
      error.value = err.message || err;

      return null;
    }
  }

  // ==============================
  // Get Units
  // PHP: getUnits($eid)
  // ==============================
  async function getUnits(sessionId) {
    try {
      const params = {
        spec: {
          itemsType: "avl_unit",
          propName: "*",
          propValueMask: "*",
          sortType: "*",
          propType: "*",
        },
        force: 0,
        flags: 1413,
        from: 0,
        to: 0,
      };

      const response = await fetchWrapper.get(
        `${apiBaseUrl}?svc=core/search_items&sid=${sessionId}&params=${encodeURIComponent(
          JSON.stringify(params),
        )}`,
      );

      units.value = response?.items || [];

      return units.value;
    } catch (err) {
      console.error("getUnits error:", err);
      error.value = err.message || err;

      return null;
    }
  }

  // ==============================
  // Get Customers
  // PHP: getCustomers($eid)
  // ==============================
  async function getCustomers(sessionId) {
    try {
      const params = {
        spec: {
          itemsType: "avl_resource",
          propName: "rel_is_account",
          propValueMask: "1",
          sortType: "rel_is_account",
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 0,
      };

      const response = await fetchWrapper.get(
        `${apiBaseUrl}?svc=core/search_items&sid=${sessionId}&params=${encodeURIComponent(
          JSON.stringify(params),
        )}`,
      );

      customers.value = response?.items || [];

      return customers.value;
    } catch (err) {
      console.error("getCustomers error:", err);
      error.value = err.message || err;

      return null;
    }
  }

  // ==============================
  // Load All Data
  // ==============================
  async function loadData() {
    loading.value = true;
    error.value = null;

    try {
      // ต้องมี getEid() อยู่ใน store เดียวกัน
      const sessionId = await getEid("2.0");

      if (!sessionId) {
        throw new Error("Cannot get Wialon session ID");
      }

      eid.value = sessionId;

      await Promise.all([
        getAllType(sessionId),
        getUnits(sessionId),
        getCustomers(sessionId),
      ]);
    } catch (err) {
      console.error("loadData error:", err);
      error.value = err.message || err;
    } finally {
      loading.value = false;
    }
  }

  return {
    eid,
    units,
    types,
    customers,
    loading,
    error,

    getAllType,
    getUnits,
    getCustomers,
    loadData,
  };
});
