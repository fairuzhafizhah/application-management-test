<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay">
      <div class="modal user-modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ mode === 'edit' ? 'Edit User' : 'Add New User' }}</h2>
          <button class="modal-close" @click.prevent="$emit('cancel')">×</button>
        </div>
        <div class="modal-divider"></div>

        <div v-if="error" class="modal-error">{{ error }}</div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Name</label>
            <input v-model="local.name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="local.email" type="email" class="form-input" />
          </div>
          <div class="form-group" v-if="mode==='create'">
            <label>Password</label>
            <input v-model="local.password" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="local.role" class="form-input">
              <option
                v-for="item in props.roles"
                :key="item.id || item.role"
                :value="item.role"
              >
                {{ item.role.charAt(0).toUpperCase() + item.role.slice(1) }}
              </option>
            </select>
          </div>
        </div>

        <div class="modal-divider"></div>
        
        <div class="modal-actions">
          <button class="btn-update" @click.prevent="submit" :disabled="loading">
            {{ loading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Update') }}
          </button>
          <button class="btn-cancel" @click.prevent="$emit('cancel')" :disabled="loading">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
    import { ref, watch, toRefs } from 'vue'
    import '@/assets/css/modal-global.css'

    const props = defineProps({
    visible: Boolean,
    mode: { type: String, default: 'create' },
    initialData: { type: Object, default: () => ({}) },
    // array of roles for dropdown (each item should have { id?, role })
    roles: { type: Array, default: () => [] }
    })
    const emit = defineEmits(['save', 'cancel'])

    const local = ref({ name: '', email: '', password: '', role: 'user' })
    const loading = ref(false)
    const error = ref('')

    watch(
    () => props.initialData,
    (v) => {
        if (props.mode === 'edit' && v) {
        local.value = { ...v }
        // do not copy password
        delete local.value.password
        } else {
        local.value = { name: '', email: '', password: '', role: 'user' }
        }
    },
    { immediate: true }
    )

    const submit = async () => {
    loading.value = true
    error.value = ''
    try {
        await emit('save', { ...local.value })
    } catch (e) {
        error.value = e.message || 'Error'
    } finally {
        loading.value = false
    }
    }
</script>
