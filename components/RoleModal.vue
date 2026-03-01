<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay">
      <div class="modal user-modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ mode === 'edit' ? 'Edit Role' : 'Add New Role' }}</h2>
          <button class="modal-close" @click.prevent="$emit('cancel')">×</button>
        </div>
        <div class="modal-divider"></div>

        <div v-if="error" class="modal-error">{{ error }}</div>

        <div class="modal-body">
          <div class="form-group">
            <label>Role</label>
            <input v-model="local.role" type="text" class="form-input" />
          </div>
        </div>

        <div class="modal-divider"></div>

        <div class="modal-actions">
          <button class="btn-update" @click.prevent="submit" :disabled="loading">
            {{ loading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create') }}
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
  import { ref, watch } from 'vue'
  import '@/assets/css/modal-global.css' // reuse styles

  const props = defineProps({
    visible: Boolean,
    mode: { type: String, default: 'create' },
    initialData: { type: Object, default: () => ({}) }
  })
  const emit = defineEmits(['save', 'cancel'])

  const local = ref({ role: '' })
  const loading = ref(false)
  const error = ref('')

  watch(
    () => props.initialData,
    (v) => {
      if (props.mode === 'edit' && v) {
        local.value = { ...v }
      } else {
        local.value = { role: '' }
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