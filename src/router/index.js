import { createRouter, createWebHashHistory } from 'vue-router'
import ItemForm from '../views/ItemForm.vue'
import AreaForm from '../views/AreaForm.vue'
import ContainerForm from '../views/ContainerForm.vue'
import ContainerView from '../views/ContainerView.vue'
import ItemView from '../views/ItemView.vue'
import AreaView from '../views/AreaView.vue'

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
  },
  {
    path: '/items/:itemId',
    name: 'item',
    component: ItemView,
    props: true
  },
  {
    path: '/areas/:areaId',
    name: 'area',
    component: AreaView,
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
