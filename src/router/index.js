import DefaultContainer from '@/containers/DefaultContainer'
import LoginView from '../views/Login.vue'
import MainView from '../views/Main'
import NotFoundView from '../views/NotFound'
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
      if (isAuthenticated()) next('/main')
      else next()
    }
  },
  {
    path: '/',
    name: 'DefaultContainer',
    redirect: '/main',
    component: DefaultContainer,
    children: [
      {
        path: '/main',
        name: 'Main',
        component: MainView
      },
      {
        path: '*',
        name: 'NotFound',
        component: NotFoundView
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (isAuthenticated() || to.name === 'Login') next()
  else {
    next('/login')
  }
})

export default router
