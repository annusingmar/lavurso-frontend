import { useUserStore } from "src/stores/user";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// export default route(function (/* { store, ssrContext } */) {
const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === "history"
  ? createWebHistory
  : createWebHashHistory;

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.VUE_ROUTER_BASE),
});

Router.beforeEach((to) => {
  const store = useUserStore();
  if (to.path !== "/login" && !store.isAuthenticated) {
    return { path: "/login", query: { redirect: to.path } };
  } else if (to.path === "/login" && store.isAuthenticated) {
    return { path: "/" };
  } else if (to.path === "/") {
    switch (store.role) {
      case "admin":
      case "teacher":
        return { path: "/teacher/journals" };
      case "student":
        return { path: "/students/" + store.id };
      case "parent":
        if (store.children && store.children.length > 0) {
          return { path: "/students/" + store.children[0].id };
        }
    }
  }
  switch (to.meta.level) {
    case "admin":
      if (!store.role === "admin") {
        return { path: "/access-denied" };
      }
      break;
    case "teacher":
      if (!store.role === "teacher" && !store.role === "admin") {
        return { path: "/access-denied" };
      }
  }
});

export default Router;
//});
