import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Initialize from localStorage
  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  // Register
  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    marketing: boolean
  }) => {
    try {
      loading.value = true
      error.value = null

      const response = await authAPI.register(userData)

      user.value = response.user
      token.value = response.token

      return { success: true, message: response.message }
    } catch (error_: any) {
      error.value = error_.response?.data?.message || 'Erreur lors de l\'inscription'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Login
  const login = async (credentials: { email: string, password: string }) => {
    try {
      loading.value = true
      error.value = null

      const response = await authAPI.login(credentials)

      user.value = response.user
      token.value = response.token

      return { success: true, message: response.message }
    } catch (error_: any) {
      error.value = error_.response?.data?.message || 'Erreur lors de la connexion'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = () => {
    authAPI.logout()
    user.value = null
    token.value = null
    error.value = null
  }

  // Get current user
  const getCurrentUser = async () => {
    try {
      loading.value = true
      const response = await authAPI.getCurrentUser()
      user.value = response.user
      return response.user
    } catch (error_: any) {
      error.value = error_.response?.data?.message || 'Erreur lors de la récupération de l\'utilisateur'
      logout()
      throw error_
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    initAuth,
    register,
    login,
    logout,
    getCurrentUser,
  }
})
