<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const router = useRouter();
const route = useRoute(); // Add this to access current route
const isLoading = ref(false);
const showMobileMenu = ref(false);

const handleLogout = async () => {
  try {
    isLoading.value = true;
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    isLoading.value = false;
  }
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

// Check if a route is active (more explicit check)
const isRouteActive = (path) => {
  return route.path === path;
};
</script>

<template>
  <nav class="navigation">
    <div class="nav-container">
      <!-- Left Side - Logo -->
      <div class="nav-left">
        <div class="nav-logo">
          <router-link to="/dashboard">PlanningPortal</router-link>
        </div>
      </div>
      
      <!-- Right Side - Logout Button -->
      <div class="nav-right">
        <div class="nav-links-container-desktop">
          <div class="nav-links desktop-links">
            <router-link to="/dashboard" class="nav-link" :class="{ 'active': isRouteActive('/dashboard') }">Dashboard</router-link>
            <router-link to="/kalender" class="nav-link" :class="{ 'active': isRouteActive('/kalender') }">Egen kalender</router-link>
          </div>
          <div class="logout-button-container">
            <button 
              @click="handleLogout" 
              class="logout-button"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Logger ud...</span>
              <span v-else>Log ud</span>
            </button>
          </div>
        </div>
        <!-- Mobile menu button -->
        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <div class="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>
    
    <!-- Mobile Navigation Menu -->
    <div class="mobile-nav" :class="{ 'show': showMobileMenu }">
      <router-link to="/dashboard" class="mobile-nav-link" :class="{ 'active': isRouteActive('/dashboard') }" @click="showMobileMenu = false">
        Dashboard
      </router-link>
      <router-link to="/kalender" class="mobile-nav-link" :class="{ 'active': isRouteActive('/kalender') }" @click="showMobileMenu = false">
        Egen kalender
      </router-link>
      <button @click="handleLogout" class="mobile-logout-button" :disabled="isLoading">
        <span v-if="isLoading">Logger ud...</span>
        <span v-else>Log ud</span>
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.navigation {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 0;
  
  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $nav-height;
    padding: 0 30px;
    width: 100%;
    margin: 0 auto;
  }
  
  .nav-left {
    display: flex;
    align-items: center;
  }
  
  .nav-logo {
    font-size: 24px;
    font-weight: 700;
    
    a {
      color: $primary-color;
      text-decoration: none;
      transition: color 0.3s;
      
      &:hover {
        color: $secondary-color;
      }
    }
  }

  .nav-links-container-desktop {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 30px;
  }
  
  .nav-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .nav-links {
    display: flex;
    gap: 30px;
    
    .nav-link {
      color: $text-color;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
      padding: 8px 0;
      position: relative;
      transition: color 0.3s;
      
      &:hover, &.router-link-active, &.active {
        color: $primary-color;
      }
      
      &.router-link-active:after, &.active:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: $primary-color;
        border-radius: 3px 3px 0 0;
      }
    }
  }
  
  .logout-button {
    padding: 10px 20px;
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background-color: $secondary-color;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:disabled {
      background-color: lighten($primary-color, 20%);
      cursor: not-allowed;
    }
  }
  
  // Mobile menu button
  .mobile-menu-button {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    width: 30px;
    height: 24px;
    margin-left: 15px;
    padding: 0;
    
    .menu-icon {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      span {
        display: block;
        height: 3px;
        width: 100%;
        background-color: $text-color;
        border-radius: 3px;
        transition: all 0.3s ease;
      }
    }
  }
  
  // Mobile navigation menu
  .mobile-nav {
    display: none;
    position: absolute;
    top: $nav-height;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    padding: 20px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    
    &.show {
      opacity: 1;
      visibility: visible;
    }
    
    .mobile-nav-link {
      padding: 15px 0;
      color: $text-color;
      text-decoration: none;
      font-weight: 500;
      font-size: 18px;
      border-bottom: 1px solid #eee;
      
      &:hover, &.router-link-active, &.active {
        color: $primary-color;
      }
    }
    
    .mobile-logout-button {
      margin-top: 20px;
      padding: 12px 0;
      width: 100%;
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      
      &:hover:not(:disabled) {
        background-color: $secondary-color;
      }
      
      &:disabled {
        background-color: lighten($primary-color, 20%);
        cursor: not-allowed;
      }
    }
  }
  
  // Media queries for responsive design
  @media (max-width: $mobile-breakpoint) {
    .desktop-links {
      display: none;
    }

    .logout-button-container {
      display: none;
    }
    
    .mobile-menu-button {
      display: block;
    }
    
    .mobile-nav {
      display: flex;
    }
  }
}
</style>