<script setup lang="ts">
import { ref } from 'vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import '@/assets/css/login.css'

// check if user is already authenticated
const { data: user } = await useFetch('/api/me')
if (user.value) {
  // user is already logged in, redirect to dashboard
  await navigateTo('/dashboard')
}

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const login = async () => {
  errorMessage.value = ''
  try {
    isLoading.value = true
    await $fetch('/api/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    navigateTo('/dashboard')
  } catch (err: any) {
    // display simple popup/notification
    errorMessage.value = err?.statusMessage || 'Login failed'
    // fallback alert if you prefer a browser popup
    alert(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <LoadingOverlay :visible="isLoading" message="Logging in..." />
    <div class="login-card">
      <h2 class="title">Login</h2>

      <!-- show error notification if set -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input v-model="email" placeholder="Enter email" class="custom-input" />
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter password"
          class="custom-input"
        />
      </div>

      <div class="checkbox-group">
        <input type="checkbox" v-model="showPassword" id="showPass" />
        <label for="showPass">Show Password</label>
      </div>

      <UButton block class="login-button" @click="login">
        SIGN IN
      </UButton>

      <!-- <div class="links">
        <p>
          Forgot <a href="#">Username / Password?</a>
        </p>
        <p>
          Don't have an account?
          <a href="#">Sign up</a>
        </p>
      </div> -->
    </div>
  </div>
</template>