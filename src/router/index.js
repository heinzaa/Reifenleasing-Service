import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import NotFound from '../views/NotFound.vue'
const Registration = () => import('../views/Registration.vue')
import AddCustomer from '../views/AddCustomer.vue'
import ContractView from '../views/ContractView.vue'

const routes = [
  {
    path: '/',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
      path: '/Dashboard',
      component: Dashboard
  },
  {
    path: '/addCustomer',
    name: 'AddCustomer',
    component: AddCustomer
  },
  {
    path: '/contract/:id',
    name: 'contract',
    component: ContractView,
    props: true
  },
  {
    path: '/:callAll(.*)',
    name: '404Name',
    component: NotFound
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router