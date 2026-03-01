<script setup>
function goToLogin() {
  navigateTo('/login')
}
</script>

<template>
  <div class="container">
    <div class="content">
      <p class="welcome">Welcome To</p>
      <h1>
        Application <br />
        User <br />
        Management
      </h1>
      <p class="created">Created by Hafizhah</p>
    </div>

    <button class="signin-btn" @click="goToLogin">
      SIGN IN
    </button>

    <div class="circle top-left"></div>
    <div class="circle bottom-right"></div>
    <div class="dotted dotted-top"></div>
    <div class="dotted dotted-bottom"></div>
  </div>
</template>

<style>
@import '@/assets/css/index.css';
</style>