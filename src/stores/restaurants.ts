import { defineStore } from 'pinia'
import { ref } from 'vue'

import { restaurantsAPI } from '@/services/api'

export interface Restaurant {
  _id: string
  name: string
  rating: number
  category: string
  time: number
  deliveryFee: number
  promo?: string
  color1: string
  color2: string
  image: string
}

export const useRestaurantsStore = defineStore('restaurants', () => {
  const restaurants = ref<Restaurant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all restaurants
  const fetchRestaurants = async (filters?: {
    category?: string
    minRating?: number
    maxDeliveryFee?: number
    maxTime?: number
  }) => {
    try {
      loading.value = true
      error.value = null

      const response = await restaurantsAPI.getAll(filters)
      restaurants.value = response.restaurants

      return response.restaurants
    } catch (error_: any) {
      error.value = error_.response?.data?.message || 'Erreur lors de la récupération des restaurants'
      throw error_
    } finally {
      loading.value = false
    }
  }

  // Fetch restaurant by ID
  const fetchRestaurantById = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await restaurantsAPI.getById(id)
      return response.restaurant
    } catch (error_: any) {
      error.value = error_.response?.data?.message || 'Erreur lors de la récupération du restaurant'
      throw error_
    } finally {
      loading.value = false
    }
  }

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    fetchRestaurantById,
  }
})
