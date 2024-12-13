<template lang="pug">
  .header-container
    .header-content
      .logo-section
        // router-link(to="/") Task Manager
        h1.text-xl.font-bold Task Manager

      .user-section(v-if="isAuthenticated")
        Button.p-button-danger(
          label="Çıkış Yap"
          icon="pi pi-sign-out"
          @click="handleLogout"
          :loading="loading"
        )
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const loading = computed(() => authStore.loading)

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Çıkış yapılırken hata oluştu:', error)
  }
}
</script>

<style scoped>
.header-container {
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  padding: 1rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}
</style>