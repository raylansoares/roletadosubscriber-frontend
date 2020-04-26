import DefaultContainer from '@/containers/DefaultContainer'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard'
import WheelConfigView from '../views/WheelConfig'
import WheelView from '../views/Wheel'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { isAuthenticated } from '../utils/utils'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) next('/dashboard')
      else next()
    }
  },
  {
    path: '/wheel',
    name: 'Wheel',
    component: WheelView
  },
  {
    path: '/',
    name: 'DefaultContainer',
    redirect: '/dashboard',
    component: DefaultContainer,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: '/wheelConfig',
        name: 'WheelConfig',
        component: WheelConfigView
      },
      {
        path: '*',
        name: 'NotFound',
        redirect: '/dashboard',
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (isAuthenticated() || to.name === 'Login' || to.name === 'Wheel') next()
  else {
    next('/login')
  }
})

export default router
