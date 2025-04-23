<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import NavigationComp from '@/components/NavigationComp.vue';

const route = useRoute();
const isLoginPage = computed(() => route.name === 'Login');
const isAuthReady = ref(false);
const isAuthenticated = ref(false);

onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
    isAuthReady.value = true;
    // No need to unsubscribe on mount as we want to track auth state changes
  });
});

// Only show navigation when auth is ready AND we're not on login page AND user is authenticated
const shouldShowNavigation = computed(() => 
  isAuthReady.value && !isLoginPage.value && isAuthenticated.value
);
</script>

<template>
  <div v-if="isAuthReady">
    <header v-if="shouldShowNavigation">
      <NavigationComp />
    </header>
    <RouterView />
  </div>
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  width: 100%;
}

.logo {
  display: block;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>