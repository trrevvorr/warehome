import { createRouter, createWebHashHistory } from 'vue-router'
import ItemForm from '../views/ItemForm.vue'
import AreaForm from '../views/AreaForm.vue'
import ContainerForm from '../views/ContainerForm.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ItemForm
  },
  {
    path: '/items',
    name: 'items',
    component: ItemForm
  },
  {
    path: '/areas',
    name: 'areas',
    component: AreaForm
  },
  {
    path: '/containers',
    name: 'containers',
    component: ContainerForm
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
