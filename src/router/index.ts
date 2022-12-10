import { createRouter, createWebHashHistory } from 'vue-router'
import ItemForm from '../views/ItemForm.vue'
import ContainerForm from '../views/ContainerForm.vue'
import ContainerView from '../views/ContainerView.vue'
import ItemView from '../views/ItemView.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      return '/items'
    }
  },
  {
    path: '/items',
    name: 'items',
    component: ItemForm
  },
  {
    path: '/containers',
    name: 'containers',
    component: ContainerForm
  },
  {
    path: '/items/:itemId',
    name: 'item',
    component: ItemView,
    props: true
  },
  {
    path: '/containers/:containerId',
    name: 'container',
    component: ContainerView,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
