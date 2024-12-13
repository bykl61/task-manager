<!-- App.vue -->
<template>
  <div id="app">
    <Toast />
    <div class="layout">
      <AppHeader v-if="!$route.meta.hideHeader" />
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue';

const authStore = useAuthStore()
const router = useRouter()

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  if (token) {
    authStore.token = token
    // authStore.loadUser()
  }
})
</script>

<style>
.layout {
  min-height: 100vh;
  background-color: var(--surface-ground);
}
</style>