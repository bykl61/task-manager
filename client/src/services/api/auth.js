import api from './axios'

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  handleError(error) {
    return {
      message: error.response?.data?.message || 'Bir hata oluştu',
      status: error.response?.status,
      errors: error.response?.data?.errors
    }
  }
}