import { commonMenus } from "@/layouts/commonMenus";
import { getRole } from "@/utils/getStorage";

const userPermissions = Array.isArray(getRole()) ? getRole() : ["Guest"];

function createMenu() {
  function filterMenu(menuItem) {
    const allowed = menuItem.permissions?.some((permission) =>
      userPermissions.includes(permission)
    );

    if (!allowed) return null;

    const newItem = { ...menuItem };

    if (Array.isArray(menuItem.children) && menuItem.children.length > 0) {
      newItem.children = menuItem.children
        .map((child) => filterMenu(child))
        .filter(Boolean);
    }

    return newItem;
  }

  return commonMenus.map((menu) => filterMenu(menu)).filter(Boolean);
}

const sidebarItem = [];

function addMenuItems(menuItems) {
  menuItems.forEach((item) => {
    sidebarItem.push(item);
  });
}

addMenuItems(createMenu());

export default sidebarItem;
