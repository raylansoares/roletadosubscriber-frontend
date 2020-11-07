import DefaultContainer from "@/containers/DefaultContainer";
import IndexView from "../views/Index.vue";
import DashboardView from "../views/Dashboard";
import WheelConfigView from "../views/WheelConfig";
import WheelView from "../views/Wheel";
import Vue from "vue";
import VueRouter from "vue-router";
import { isAuthenticated } from "../utils/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: IndexView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) next("/dashboard");
      else next();
    }
  },
  {
    path: "/login/callback",
    name: "Callback",
    component: IndexView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) next("/dashboard");
      else next();
    }
  },
  {
    path: "/wheel",
    name: "Wheel",
    component: WheelView
  },
  {
    path: "/",
    name: "DefaultContainer",
    redirect: "/dashboard",
    component: DefaultContainer,
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: DashboardView
      },
      {
        path: "/wheelConfig",
        name: "WheelConfig",
        component: WheelConfigView
      },
      {
        path: "*",
        name: "NotFound",
        redirect: "/dashboard"
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  if (
    isAuthenticated() ||
    to.name === "Index" ||
    to.name === "Callback" ||
    to.name === "Wheel"
  )
    next();
  else {
    next("/");
  }
});

export default router;
