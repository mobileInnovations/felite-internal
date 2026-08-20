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
    title: labels.home_page,
    icon: Home2Icon,
    to: "/",
    permissions: ["Admin"],
  },
  {
    title: labels.tasks,
    icon: TooltipIcon,
    to: "/tasks",
    permissions: ["Admin"],
  },

  { divider: true },
];
