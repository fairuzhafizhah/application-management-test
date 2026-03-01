<script setup>
    import { ref, computed } from 'vue'
    import RoleModal from '@/components/RoleModal.vue'
    import LoadingOverlay from '@/components/LoadingOverlay.vue'

    const { data: roles, error, refresh } = await useFetch('/api/roles')
    const { data: currentUser } = await useFetch('/api/me')
    import '@/assets/css/global.css'

    // only logged-in users can access; redirect otherwise
    if (error.value) {
    await navigateTo('/dashboard')
    }

    const isLoading = ref(false)
    const toast = ref('')
    function showToast(msg) {
    toast.value = msg
    setTimeout(() => (toast.value = ''), 3000)
    }

    const search = ref('')
    const filteredRoles = computed(() => {
    if (!roles.value) return []
    const q = search.value.toLowerCase().trim()
    if (!q) return roles.value
    return roles.value.filter(r => r.role && r.role.toLowerCase().includes(q))
    })

    // modal state
    const showModal = ref(false)
    const modalMode = ref('create')
    const selectedRole = ref(null)

    function openModal(mode = 'create', role = null) {
    modalMode.value = mode
    selectedRole.value = role ? { ...role } : null
    showModal.value = true
    }

    async function handleSave(payload) {
    try {
        isLoading.value = true
        if (modalMode.value === 'create') {
        await $fetch('/api/roles', {
            method: 'POST',
            body: payload
        })
        showToast('Role created successfully')
        } else {
        await $fetch('/api/roles', {
            method: 'PUT',
            body: { id: selectedRole.value.id, ...payload }
        })
        showToast('Role updated successfully')
        }
        await refresh()
        showModal.value = false
    } catch (e) {
        throw e
    } finally {
        isLoading.value = false
    }
    }

    async function deleteRole(role) {
    const ok = confirm(`Are you sure to delete role "${role.role}"?`)
    if (!ok) return
    try {
        isLoading.value = true
        await $fetch('/api/roles', {
        method: 'DELETE',
        body: { id: role.id }
        })
        await refresh()
        showToast('Role deleted successfully')
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
</script>

<template>
  <div class="page-wrapper">
    <LoadingOverlay :visible="isLoading" message="Processing..." />

    <div class="header-bar">
      <h1 class="header-title">Management Application - By Hafizhah</h1>
      <div class="header-user">
        <span class="user-icon">👤</span>
        <span class="user-name">{{ currentUser?.name }}</span>
        <button class="sign-out" @click.prevent="confirmSignOut">Sign Out</button>
      </div>
    </div>

    <div class="container">
      <div class="breadcrumb">
        <span class="breadcrumb-icon">🏠</span>
        <button class="breadcrumb-link" @click.prevent="navigateTo('/dashboard')">Main Menu</button>
        <span class="breadcrumb-sep">></span>
        <span>Master Roles</span>
      </div>

      <h2 class="page-title">Master Roles</h2>

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
        <button v-if="currentUser?.role === 'Admin'" class="add-button" @click.prevent="openModal('create')">+ New Role</button>
      </div>

      <RoleModal
        :visible="showModal"
        :mode="modalMode"
        :initialData="selectedRole"
        @save="handleSave"
        @cancel="showModal = false"
      />

      <div class="table-container">
        <table class="user-table">
          <div v-if="toast" class="toast">{{ toast }}</div>
          <thead>
            <tr>
              <th>ID</th>
              <th>Role</th>
              <th v-if="currentUser?.role === 'Admin'" class="actions">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in filteredRoles" :key="r.id || idx">
              <td class="no-col">{{ r.id }}</td>
              <td>{{ r.role }}</td>
              <td v-if="currentUser?.role === 'Admin'" class="actions">
                <button class="btn-edit" @click.prevent="openModal('edit', r)"><span class="action-icon">✏️</span></button>
                <button class="btn-delete" @click.prevent="deleteRole(r)"><span class="action-icon">✖</span></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <span>Total Data: <strong>{{ filteredRoles.length }}</strong></span>
      </div>
    </div>
  </div>
</template>