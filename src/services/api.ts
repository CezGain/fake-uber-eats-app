import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    marketing: boolean
  }) => {
    const response = await api.post('/api/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  login: async (credentials: { email: string, password: string }) => {
    const response = await api.post('/api/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// Restaurants API
export const restaurantsAPI = {
  getAll: async (filters?: {
    category?: string
    minRating?: number
    maxDeliveryFee?: number
    maxTime?: number
  }) => {
    const response = await api.get('/api/restaurants', { params: filters })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/restaurants/${id}`)
    return response.data
  },

  create: async (restaurantData: any) => {
    const response = await api.post('/api/restaurants', restaurantData)
    return response.data
  },

  update: async (id: string, restaurantData: any) => {
    const response = await api.put(`/api/restaurants/${id}`, restaurantData)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/restaurants/${id}`)
    return response.data
  },
}

export default api
