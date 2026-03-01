<script setup>
    import { ref } from 'vue'
    import LoadingOverlay from '@/components/LoadingOverlay.vue'
    import '@/assets/css/global.css'

    const isLoading = ref(false)

    // get the authenticated user from a dedicated endpoint
    // the `/api/users` endpoint provides a list; previously it was admin-only but now all authenticated roles may fetch it
    const { data: user, error } = await useFetch('/api/me')
    const { data: currentUser } = await useFetch('/api/me')

    // if the fetch failed (e.g. not authenticated) we could redirect back to login
    if (error.value) {
    await navigateTo('/login')
    }

    function goToMasterUser() {
    if (!user.value) return
    if (user.value) {
        navigateTo('/master-users')
    }
    }

    function goToMasterRole() {
    if (!user.value) return
    if (user.value) {
        navigateTo('/master-role')
    }
    }

    function confirmSignOut() {
    const ok = confirm('Are you sure to sign out?')
    if (ok) {
        isLoading.value = true
        $fetch('/api/logout', { method: 'POST' })
        .catch(() => {})
        .finally(() => navigateTo('/login'))
    }
    }
</script>

<template>
  <div class="page-wrapper">
    <LoadingOverlay :visible="isLoading" message="Signing out..." />
    <!-- Header bar same as admin page -->
    <div class="header-bar">
      <h1 class="header-title">Management Application - By Hafizhah</h1>
      <div class="header-user">
        <span class="user-icon">👤</span>
        <span class="user-name">{{ currentUser?.name }}</span>
        <button class="sign-out" @click.prevent="confirmSignOut">Sign Out</button>
      </div>
    </div>

    <div class="container dashboard-container">
      <h2 class="page-title">Welcome, {{ user?.name?.charAt(0).toUpperCase()+user.name.slice(1) }}!</h2>
      <div class="cards">
        <div class="card" @click="goToMasterUser">
          <div class="card-icon">👥</div>
          <div class="card-label">Master Users</div>
        </div>
        <div class="card" @click="goToMasterRole">
          <div class="card-icon">📝</div>
          <div class="card-label">Master Roles</div>
        </div>
      </div>
    </div>
  </div>
</template>