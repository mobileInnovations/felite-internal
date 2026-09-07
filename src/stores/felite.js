import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
import dayjs from "dayjs";

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

  const mergeData = ref([]);

  const loading = ref(false);
  const error = ref(null);

  // ==============================
  // Get All Hardware Types
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

      types.value = response || [];

      return types.value;
    } catch (err) {
      console.error("getAllType error:", err);
      error.value = err.message || err;
      return [];
    }
  }

  // ==============================
  // Get Units
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
      return [];
    }
  }

  // ==============================
  // Get Customers
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
      return [];
    }
  }

  // ==============================
  // Get Eid
  // ==============================
  async function getEid(version) {
    try {
      const token = WIALON_TOKENS[version];

      if (version !== 1 && version !== 2) {
        throw new Error(
          `Version ${version} is not supported. Please use version 1 or 2.`,
        );
      }

      if (!token) {
        throw new Error(`No token found for version ${version}.`);
      }

      const params = encodeURIComponent(JSON.stringify({ token }));

      const url = `${apiBaseUrl}?svc=token/login&params=${params}`;

      const response = await fetchWrapper.get(url);

      return response.eid;
    } catch (err) {
      console.error("getEid error:", err);
      throw err;
    }
  }

  // ==============================
  // Load All Data
  // ==============================
  async function loadData(version) {
    loading.value = true;
    error.value = null;

    try {
      const sessionId = await getEid(version);

      if (!sessionId) {
        throw new Error("Cannot get Wialon session ID");
      }

      eid.value = sessionId;

      await Promise.all([
        getAllType(sessionId),
        getUnits(sessionId),
        getCustomers(sessionId),
      ]);

      // Map หลังจากโหลดข้อมูลทั้งหมดเสร็จ
      mergeData.value = mapData();
    } catch (err) {
      console.error("loadData error:", err);
      error.value = err.message || err;
    } finally {
      loading.value = false;
    }
  }

  // ==============================
  // Map Units + Types + Customers
  // ==============================
  function mapData() {
    if (!units.value.length) {
      return [];
    }

    // สร้าง Map สำหรับ lookup
    const typeMap = new Map(types.value.map((item) => [item.id, item]));

    const customerMap = new Map(customers.value.map((item) => [item.id, item]));

    return units.value.map((item, index) => {
      let type = "";
      let customer = "";
      let pos = "";

      // ==============================
      // Equipment Type
      // PHP: $type_->id == $item->hw
      // ==============================
      const typeData = typeMap.get(item.hw);

      if (typeData) {
        type = typeData.name || "";
      }

      // ==============================
      // Customer
      // PHP: $customer_->id == $item->bact
      // ==============================
      const customerData = customerMap.get(item.bact);

      if (customerData) {
        customer = customerData.nm || "";
      }

      // ==============================
      // Last GPS Time
      // PHP: $item->lmsg->t
      // ==============================
      const dateTimeString =
        item.lmsg?.t != null ? formatDate(item.lmsg.t) : "";

      // ==============================
      // Last Position
      // PHP: y + "," + x
      // ==============================
      if (item.lmsg?.pos?.x != null && item.lmsg?.pos?.y != null) {
        pos = `${item.lmsg.pos.y},${item.lmsg.pos.x}`;
      }

      return {
        no: 0,
        customerName: customerData?.nm || "",
        serialNo: "",
        imeiNumber: "",
        uniqueId: item.uid || "",
        unitName: item.nm || "",
        vehicleMake: "",
        vehicleModel: "",
        licensePlate: "",
        equipmentType: typeData?.name || "",
        phoneNumber: item.ph || "",
        lastPosition: pos,
        lastGpsTime: dateTimeString,
      };
    });
  }

  function formatDate(epoch) {
    return dayjs.unix(epoch).format("MM-DD-YYYY HH:mm:ss");
  }

  return {
    eid,
    units,
    types,
    customers,
    mergeData,
    loading,
    error,

    getAllType,
    getUnits,
    getCustomers,
    loadData,
    mapData,
  };
});
