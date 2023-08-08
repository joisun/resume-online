import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
// import Admin from '../views/Admin.vue'
import NotFoundPage from '../views/404.vue'


const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.VITE_BASE_PATH as string),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/admin',
      name: 'admin',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Admin.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: NotFoundPage
    }
  ]
})

export default router
