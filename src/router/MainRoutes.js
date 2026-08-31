const MainRoutes = {
  path: "/",
  meta: {
    requiresAuth: true,
  },
  redirect: "/dashboard/default",
  component: () => import("@/layouts/full/FullLayout.vue"),
  children: [
    {
      name: "Default",
      path: "/",
      component: () => import("@/views/StarterPage.vue"),
    },
    {
      name: "FElite1.0",
      path: "/FElite1.0",
      component: () => import("@/views/FElite1.0.vue"),
    },
    {
      name: "FElite2.0",
      path: "/FElite2.0",
      component: () => import("@/views/FElite2.0.vue"),
    },
  ],
};

export default MainRoutes;
