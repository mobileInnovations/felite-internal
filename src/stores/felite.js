import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

const apiBaseUrl = "/wialon-api/wialon/ajax.html";

const WIALON_TOKENS = {
  1: "c197490d6d60f1233383fb59a0888d6859E5F07D9AE5AA3BB9BA7EF39EEE9E75CDAD7147",
  2: "f5d4418e904326f1341d2fc4ef777eeeC684DD6223DB4F3FE18329DA391560563C12A160",
};

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

  async function getEid(version) {
    try {
      const token = WIALON_TOKENS[version];
      if (!token) {
        throw new Error(`Invalid Wialon version: ${version}`);
      }
      const params = encodeURIComponent(JSON.stringify({ token }));
      const url = `${apiBaseUrl}?svc=token/login&params=${params}`;
      const response = await fetchWrapper.get(url);
      console.log("getEid response:", response);
      return response.eid;
    } catch (error) {
      console.error("getEid error:", error);
      throw error;
    }
  }

  // ==============================
  // Load All Data
  // ==============================
  async function loadData(version) {
    console.log("loadData called with version:", version);
    loading.value = true;
    error.value = null;

    try {
      // ต้องมี getEid() อยู่ใน store เดียวกัน
      const sessionId = await getEid(version); // Assuming getEid is defined elsewhere in the store

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
