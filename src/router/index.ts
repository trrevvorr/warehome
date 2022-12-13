import { createRouter, createWebHashHistory } from "vue-router";
import ItemForm from "../views/ItemForm.vue";
import ContainerForm from "../views/ContainerForm.vue";
import LoginSignUp from "../views/LoginSignUp.vue";

const routes = [
  {
    path: "/",
    redirect: () => {
      return "/items";
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginSignUp,
  },
  {
    path: "/items",
    name: "items",
    component: ItemForm,
  },
  {
    path: "/containers",
    name: "containers",
    component: ContainerForm,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
