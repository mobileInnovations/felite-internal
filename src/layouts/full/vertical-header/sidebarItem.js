import { commonMenus } from "@/layouts/commonMenus";

import { getRole } from "@/utils/getStorage";

const role = getRole();
const userPermissions = role || []; // Assuming `permissions` is an array in user object

// Select language labels (default to 'th' if not set)
const lang = localStorage.getItem("LANG") || "th";
localStorage.setItem("LANG", lang); // Set default language if not present

// Function to generate menus based on role and permissions
function createMenu() {
  const menus = [];

  function checkPermissions(menuItem) {
    if (
      menuItem.permissions?.some((permission) =>
        userPermissions.includes(permission),
      )
    ) {
      if (menuItem.children && menuItem.children.length > 0) {
        menuItem.children = menuItem.children.filter((child) =>
          checkPermissions(child),
        );
      }
      return true;
    }
    return false;
  }

  commonMenus.forEach((item) => {
    if (checkPermissions(item)) {
      menus.push(item);
    }
  });

  return menus;
}

// Sidebar header
const sidebarHeader = lang === "th" ? { header: "หน้า" } : { header: "Pages" };

// Sidebar items container
const sidebarItem = [sidebarHeader];

function addMenuItems(menuItems) {
  menuItems.forEach((item) => {
    if (
      item.permissions?.some((permission) =>
        userPermissions.includes(permission),
      )
    ) {
      sidebarItem.push(item);
    }
  });
}

addMenuItems(createMenu());

export default sidebarItem;
