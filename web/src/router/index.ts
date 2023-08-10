import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Home from '../views/Home/Home.vue'
import NotFoundPage from '../views/404.vue'


const router = createRouter({
  history: createWebHistory("/"),
  // history: createWebHashHistory(import.meta.env.VITE_BASE_PATH as string),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/Admin.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFoundPage
    }
  ]
})

export default router
