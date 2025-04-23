import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
  ],
})

// Global auth state
let currentUser = null;
let authInitialized = false;

// Set up global auth listener
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  authInitialized = true;
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  // If auth not yet initialized, wait briefly before proceeding
  if (!authInitialized) {
    const waitForAuth = () => {
      if (authInitialized) {
        // Auth is ready, now apply routing rules
        if (requiresAuth && !currentUser) {
          next('/login');
        } else if (requiresGuest && currentUser) {
          next('/');
        } else {
          next();
        }
      } else {
        // Check again in a short while
        setTimeout(waitForAuth, 50);
      }
    };
    
    waitForAuth();
    return;
  }
  
  // Auth is already initialized, apply routing rules immediately
  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresGuest && currentUser) {
    next('/');
  } else {
    next();
  }
})

export default router