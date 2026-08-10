const MainRoutes = {
  path: "/main",
  meta: {
    requiresAuth: true,
  },
  redirect: "/main/dashboard/default",
  component: () => import("@/layouts/full/FullLayout.vue"),
  children: [
    {
      name: "Default",
      path: "/",
      component: () => import("@/views/StarterPage.vue"),
    },
    {
      name:"FElite1.0",
      path:"/main/FElite1.0",
      component: () => import("@/views/FElite1.0.vue"),
    },
    {
      name:"FElite2.0",
      path:"/main/FElite2.0",
      component: () => import("@/views/FElite2.0.vue"),
    }
  ],
};

export default MainRoutes;
