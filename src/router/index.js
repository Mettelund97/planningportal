import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    // Add more authenticated routes here
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ],
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  // Get current user
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe()
    
    if (requiresAuth && !user) {
      // If route requires auth and user is not logged in
      next('/login')
    } else if (requiresGuest && user) {
      // If route is only for guests and user is logged in
      next('/dashboard')
    } else {
      // Otherwise proceed normally
      next()
    }
  })
})


export default router
