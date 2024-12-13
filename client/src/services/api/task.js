import api from './axios'

export const taskService = {
  async getTasks(params) {
    try {
      const response = await api.get('/tasks', { params })
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async createTask(formData) {
    try {
      const { data } = await api.post('/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return data; // Direkt olarak data'yı döndür
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`)
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