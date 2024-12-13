import { defineStore } from 'pinia'
import router from '@/router'
import { authService } from '@/services/api/auth.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      try {
        this.loading = true
        this.error = null

        const response = await authService.login(credentials)

        this.token = response.data.token

        localStorage.setItem('token', response.data.token)

        router.push('/tasks')
      } catch (error) {
        this.error = error.message || error.detail
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      try {
        this.loading = true
        this.error = null

        // Register işlemi yapılır
        const response = await authService.register(userData)

        // Token dönmediği için sadece başarılı mesajı alabiliriz
        if (response.success) {
          // İsteğe bağlı başarılı mesajı gösterilebilir
          this.error = null

          // Login sayfasına yönlendir
          router.push('/login')
        }

      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
})