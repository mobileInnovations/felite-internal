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
    permissions: ["Admin", "Sale", "Manager"],
  },
  {
    title: labels.tasks,
    icon: TooltipIcon,
    to: "/tasks",
    permissions: ["Sale"],
  },
  {
    title: labels.activity,
    icon: PencilIcon,
    // permissions: ["Admin", "Sale"],
    permissions: ["Admin"],
    children: [
      {
        title: `${labels.activity}`,
        icon: CircleIcon,
        to: "/activity",
        permissions: ["Admin"],
      },
      // {
      //   title: `${labels.activity_report}`,
      //   icon: CircleIcon,
      //   to: "/activity/report",
      //   permissions: ["Sale"],
      // },
    ],
  },
  {
    title: labels.customers,
    icon: UserCircleIcon,
    permissions: ["Admin", "Sale"],
    children: [
      {
        title: `${labels.customers}`,
        icon: CircleIcon,
        to: "/customers",
        permissions: ["Sale"],
      },
      {
        title: `${labels.import_customers}`,
        icon: CircleIcon,
        to: "/customers/import",
        permissions: ["Admin"],
      },
    ],
  },
  {
    title: labels.report,
    icon: FileReportIcon,
    permissions: ["Sale", "Manager"],
    children: [
      {
        title: `${labels.actions}`,
        icon: CircleIcon,
        to: "/report/actions",
        permissions: ["Manager"],
      },
      {
        title: `${labels.activity}`,
        icon: CircleIcon,
        to: "/report/activity",
        permissions: ["Sale", "Manager"],
      },
      {
        title: `${labels.teamlead}`,
        icon: CircleIcon,
        to: "/report/teamlead",
        permissions: ["Sale", "Manager"],
      },
      {
        title: `${labels.individual}`,
        icon: CircleIcon,
        to: "/report/individual",
        permissions: ["Sale", "Manager"],
      },
    ],
  },
  { divider: true },
];
