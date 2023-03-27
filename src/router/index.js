import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import NotFound from '../views/NotFound.vue'
const Registration = () => import('../views/Registration.vue')
import AddCustomer from '../views/AddCustomer.vue'
import ContractView from '../views/ContractView.vue'

import { supabase } from '../supabase'

const requireAuth = async (to, from, next) => {

const { data: { session } } = await supabase.auth.getSession()
   
  if(!session?.user){
    window.alert("Um auf die gewünschte Seite navigieren zu können, müssen Sie angemeldet sein und ihre Email verifiziert haben.")
    next({ name: 'Login' })
    return
  }
  else {
    next()
    return 
  }
}

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
      component: Dashboard,
      beforeEnter: requireAuth
  },
  {
    path: '/addCustomer',
    name: 'AddCustomer',
    component: AddCustomer,
    beforeEnter: requireAuth
  },
  {
    path: '/contract/:id',
    name: 'contract',
    component: ContractView,
    props: true,
    beforeEnter: requireAuth
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