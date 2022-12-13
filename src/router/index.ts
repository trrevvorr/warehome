import { createRouter, createWebHashHistory } from "vue-router";
import ItemForm from "../views/ItemForm.vue";
import ContainerForm from "../views/ContainerForm.vue";
import LoginSignUp from "../views/LoginSignUp.vue";
import { Auth } from "aws-amplify";

export enum RouteNames {
  Login = "login",
  Items = "items",
  Containers = "containers",
}

const routes = [
  {
    path: "/",
    redirect: () => {
      return "/items";
    },
  },
  {
    path: "/login",
    name: RouteNames.Login,
    component: LoginSignUp,
  },
  {
    path: "/items",
    name: RouteNames.Items,
    component: ItemForm,
  },
  {
    path: "/containers",
    name: RouteNames.Containers,
    component: ContainerForm,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !(await isAuthenticated()) &&
    // Avoid an infinite redirect
    to.name !== RouteNames.Login
  ) {
    // redirect the user to the login page
    return { name: RouteNames.Login };
  }
});

async function isAuthenticated() {
  try {
    await Auth.currentAuthenticatedUser();
    return true;
  } catch {
    console.warn("User is not authenticated");
    return false;
  }
}

export default router;
