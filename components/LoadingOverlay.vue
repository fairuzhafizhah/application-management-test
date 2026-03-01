<template>
  <transition name="fade">
    <div v-if="visible" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p v-if="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: '' }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  border: 4px solid #e8eef5;
  border-top: 4px solid #1a1f4d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-message {
  margin: 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
