import { createRouter, createWebHistory } from "vue-router";
import MainRoutes from "./MainRoutes";
import AuthRoutes from "./AuthRoutes";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/error/Error404Page.vue"),
    },
    MainRoutes,
    AuthRoutes,
  ],
});

router.beforeEach(async (to) => {
  const publicPages = ["/auth/login"];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return "/auth/login";
    }

    return;
  }

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return "/";
  }

  return;
});

export default router;
