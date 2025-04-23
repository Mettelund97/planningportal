<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const router = useRouter();
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  // Reset error message
  errorMessage.value = '';
  
  // Simple validation
  if (!username.value || !password.value) {
    errorMessage.value = 'Brugernavn og adgangskode er påkrævet';
    return;
  }
  
  try {
    isLoading.value = true;
    
    // Firebase authentication
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      username.value, 
      password.value
    );
    
    // If successful, get the user
    const user = userCredential.user;
    console.log('User logged in:', user);
    
    // If "remember me" is not checked, set persistence to SESSION
    // This would require importing setPersistence and browserSessionPersistence
    // from firebase/auth and setting it before signInWithEmailAndPassword
    
    // Redirect to dashboard or home page
    router.push('/dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific Firebase auth errors
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Ugyldig email format';
        break;
      case 'auth/user-not-found':
        errorMessage.value = 'Bruger ikke fundet';
        break;
      case 'auth/wrong-password':
        errorMessage.value = 'Forkert adgangskode';
        break;
      case 'auth/too-many-requests':
        errorMessage.value = 'For mange forsøg. Prøv igen senere';
        break;
      default:
        errorMessage.value = 'Login fejlede. Prøv igen senere';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">PlanningPortal</div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        
        <div class="form-group">
          <label for="username">Email</label>
          <input 
            type="email" 
            id="username" 
            v-model="username" 
            placeholder="Indtast din email"
            autocomplete="email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Adgangskode</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Indtast din adgangskode"
            autocomplete="current-password"
          />
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Husk mig</span>
          </label>
          <a href="#" class="forgot-password">Glemt adgangskode?</a>
        </div>
        
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isLoading"
        >
          <span v-if="isLoading">Logger ind...</span>
          <span v-else>Log ind</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-color: #3498db;
$secondary-color: #2980b9;
$error-color: #e74c3c;
$box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
$border-radius: 8px;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  
  .login-card {
    width: 100%;
    max-width: 500px;
    padding: 40px;
    background-color: white;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 30px;
      color: $primary-color;
      letter-spacing: 0.5px;
    }
    
    .login-form {
      .error-message {
        padding: 10px;
        margin-bottom: 15px;
        background-color: rgba($error-color, 0.1);
        color: $error-color;
        border-radius: 4px;
        font-size: 14px;
      }
      
      .form-group {
        margin-bottom: 20px;
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: $border-radius;
          font-size: 16px;
          transition: border 0.3s;
          
          &:focus {
            border-color: $primary-color;
            outline: none;
          }
          
          &::placeholder {
            color: #aaa;
          }
        }
      }
      
      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        
        .remember-me {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          input {
            margin-right: 8px;
          }
          
          span {
            font-size: 14px;
            color: #555;
          }
        }
        
        .forgot-password {
          font-size: 14px;
          color: $primary-color;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .login-button {
        width: 100%;
        padding: 12px;
        background-color: $primary-color;
        color: white;
        border: none;
        border-radius: $border-radius;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover:not(:disabled) {
          background-color: $secondary-color;
        }
        
        &:disabled {
          background-color: lighten($primary-color, 20%);
          cursor: not-allowed;
        }
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .login-container {
    .login-card {
      padding: 25px;
      
      .logo {
        font-size: 24px;
      }
      
      .login-form {
        .form-group {
          input {
            padding: 10px 12px;
          }
        }
        
        .form-options {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
      }
    }
  }
}
</style>