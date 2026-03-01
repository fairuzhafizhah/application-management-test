<script setup>
  import { ref, computed } from 'vue'
  import UserModal from '@/components/UserModal.vue'
  import LoadingOverlay from '@/components/LoadingOverlay.vue'

  const { data: users, error, refresh } = await useFetch('/api/users')
  const { data: currentUser } = await useFetch('/api/me')
  // fetch available roles so dropdown stays in sync
  const { data: roles } = await useFetch('/api/roles')

  import '@/assets/css/global.css'

  // loading state
  const isLoading = ref(false)

  // toast message
  const toast = ref('')
  function showToast(msg) {
    toast.value = msg
    setTimeout(() => (toast.value = ''), 3000)
  }

  const search = ref('')

  // determine which roles the local user may pick when creating/editing
  const availableRoles = computed(() => {
    if (!roles.value) return []
    if (currentUser.value && currentUser.value.role === 'Admin') {
      return roles.value
    }
    // managers/users only see plain user option
    return roles.value.filter(r => r.role === 'user')
  })

  const filteredUsers = computed(() => {
    if (!users.value) return []
    const q = search.value.toLowerCase().trim()
    if (!q) return users.value
    return users.value.filter(u => {
      return [u.name, u.email, u.role, u.nama, u.title]
        .some(field => field && field.toLowerCase().includes(q))
    })
  })

  // modal state
  const showModal = ref(false)
  const modalMode = ref('create')
  const selectedUser = ref(null)

  function openModal(mode = 'create', user = null) {
    modalMode.value = mode
    selectedUser.value = user ? { ...user } : null
    showModal.value = true
  }

  async function handleSave(payload) {
    // payload contains name,email,password? role
    try {
      isLoading.value = true
      if (modalMode.value === 'create') {
        await $fetch('/api/register', {
          method: 'POST',
          body: payload
        })
        showToast('Data created successfully')
      } else {
        await $fetch('/api/users', {
          method: 'PUT',
          body: { id: selectedUser.value.id, ...payload }
        })
        showToast('Data updated successfully')
      }
      await refresh()
      showModal.value = false
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(user) {
    // Prevent user from deleting their own account
    if (currentUser.value && currentUser.value.id === user.id) {
      alert('You cannot delete your own account')
      return
    }

    const name = user.name
    const ok = confirm(`Are you sure to delete user "${name}"?`)
    if (!ok) return
    try {
      isLoading.value = true
      await $fetch('/api/users', {
        method: 'DELETE',
        body: { id: user.id }
      })
      await refresh()
      showToast('Data deleted successfully')
    } catch (e) {
      alert(e.message || 'Failed to delete')
    } finally {
      isLoading.value = false
    }
  }

  function confirmSignOut() {
    const ok = confirm('Are you sure to sign out?')
    if (ok) {
      $fetch('/api/logout', { method: 'POST' })
        .catch(() => {})
        .finally(() => navigateTo('/login'))
    }
  }

  if (error.value) {
    // if unauthorized or other error, redirect to dashboard or login
    await navigateTo('/dashboard')
  }
</script>

<template>
  <div class="page-wrapper">
    <LoadingOverlay :visible="isLoading" message="Processing..." />
    <!-- Header -->
    <div class="header-bar">
      <h1 class="header-title">Management Application - By Hafizhah</h1>
      <div class="header-user">
        <span class="user-icon">👤</span>
        <span class="user-name">{{ currentUser?.name }}</span>
        <button class="sign-out" @click.prevent="confirmSignOut">Sign Out</button>
      </div>
    </div>

    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span class="breadcrumb-icon">🏠</span>
        <button class="breadcrumb-link" @click.prevent="navigateTo('/dashboard')">Main Menu</button>
        <span class="breadcrumb-sep">></span>
        <span>Master Users</span>
      </div>

      <!-- Page Title -->
      <h2 class="page-title">Master Users</h2>

      <!-- Controls -->
      <div class="controls-bar">
        <div class="search-wrapper">
          <input
            class="search-input"
            type="text"
            placeholder=""
            v-model="search"
          />
          <button class="search-icon" @click.prevent="search = ''">✕</button>
        </div>
        <button v-if="currentUser?.role !== 'user'" class="add-button" @click.prevent="openModal('create')">+ New User</button>
      </div>

      <UserModal
        :visible="showModal"
        :mode="modalMode"
        :initialData="selectedUser"
        :roles="availableRoles"
        @save="handleSave"
        @cancel="showModal = false"
      />

      <!-- Table Container -->
      <div class="table-container">
        <table class="user-table">
          <div v-if="toast" class="toast">{{ toast }}</div>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th v-if="currentUser?.role === 'Admin'" class="actions">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(u, idx) in filteredUsers" :key="u.id || idx">
              <td class="no-col">{{ idx + 1 }}</td>
              <td>{{ u.name || u.nama || u.title || '—' }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.role }}</td>
              <td v-if="currentUser?.role === 'Admin'" class="actions">
                <button class="btn-edit" @click.prevent="openModal('edit', u)"><span class="action-icon">✏️</span></button>
                <button class="btn-delete" @click.prevent="deleteUser(u)"><span class="action-icon">✖</span></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Data Footer -->
      <div class="table-footer">
        <span>Total Data: <strong>{{ filteredUsers.length }}</strong></span>
      </div>

    </div>
  </div>
</template>
