<template>
  <div
    class="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    @click="$emit('click', restaurant)"
  >
    <div class="relative">
      <img
        v-if="restaurant.image"
        :alt="restaurant.name"
        class="h-48 w-full object-cover"
        :src="restaurant.image"
      >
      <div v-else class="h-48 bg-linear-to-br" :style="{ backgroundImage: `linear-gradient(135deg, ${restaurant.color1}, ${restaurant.color2})` }" />
      <div v-if="restaurant.promo" class="absolute top-4 left-4 bg-uber-green text-white px-3 py-1 rounded-full text-sm font-semibold">
        {{ restaurant.promo }}
      </div>
      <div class="absolute bottom-4 right-4 bg-white text-uber-text-dark px-3 py-1 rounded-full text-sm font-semibold">
        {{ restaurant.time }} min
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-bold text-lg text-uber-text-dark mb-1">{{ restaurant.name }}</h3>
      <div class="flex items-center gap-2 text-sm text-uber-text-gray">
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-uber-green" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {{ restaurant.rating }}
        </span>
        <span>•</span>
        <span>{{ restaurant.category }}</span>
        <span>•</span>
        <span>{{ restaurant.deliveryFee === 0 ? 'Livraison gratuite' : `${restaurant.deliveryFee.toFixed(2)}€` }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Restaurant {
    _id?: string
    id?: number
    name: string
    rating: number
    category: string
    time: number
    deliveryFee: number
    promo?: string
    color1: string
    color2: string
    image?: string
  }

  interface Props {
    restaurant: Restaurant
  }

  defineProps<Props>()

  defineEmits<{
    click: [restaurant: Restaurant]
  }>()
</script>
