import {
  CircleIcon,
  FileReportIcon,
  PencilIcon,
  TooltipIcon,
  Home2Icon,
  UserCircleIcon,
} from "vue-tabler-icons";
import th from "@/locales/th.json";
import en from "@/locales/en.json";

const lang = localStorage.getItem("LANG") || "th";
localStorage.setItem("LANG", lang); // Set default language if not present

const labels = lang === "th" ? th : en;

export const commonMenus = [
  {
    title: "FElite1.0",
    icon: TooltipIcon,
    to: "/FElite1.0",
    permissions: ["Admin"],
  },
  {
    title: "FElite2.0",
    icon: TooltipIcon,
    to: "/FElite2.0",
    permissions: ["Admin"],
  },

  { divider: true },
];
