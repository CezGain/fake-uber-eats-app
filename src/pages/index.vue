<template>
  <div class="min-h-screen bg-uber-light-gray">
    <!-- Header -->
    <header class="bg-white border-b border-uber-border sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="#06c167" />
            </svg>
            <span class="text-2xl font-bold text-uber-text-dark">UberEats</span>
          </div>

          <!-- Address Search -->
          <div class="hidden md:flex flex-1 max-w-2xl mx-8">
            <div class="relative w-full">
              <UberInput
                v-model="address"
                class="pl-12 rounded-full bg-uber-light-gray placeholder:text-uber-gray text-uber-black"
                placeholder="Entrer l'adresse de livraison"
                type="text"
              />
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-uber-text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- User Actions -->
          <div class="flex items-center gap-4">
            <template v-if="authStore.isAuthenticated">
              <span class="text-sm text-uber-text-dark">
                Bonjour, {{ authStore.user?.firstName }}
              </span>
              <button
                class="px-6 py-2 text-uber-text-dark hover:bg-uber-light-gray rounded-full transition-colors font-medium"
                @click="handleLogout"
              >
                Déconnexion
              </button>
            </template>
            <template v-else>
              <button class="px-6 py-2 text-uber-text-dark hover:bg-uber-light-gray rounded-full transition-colors font-medium" @click="goToLogin">
                Se connecter
              </button>
              <UberButton class="px-6 py-2 rounded-full" :full-width="false" @click="goToRegister">
                S'inscrire
              </UberButton>
            </template>
          </div>
        </div>

        <!-- Mobile Address Search -->
        <div class="md:hidden mt-4">
          <div class="relative">
            <UberInput
              v-model="address"
              class="pl-12 rounded-full bg-uber-light-gray"
              placeholder="Entrer l'adresse de livraison"
              type="text"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-uber-text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <CategoryFilter
        :categories="categories"
        :selected-category="selectedCategory"
        @update:selected-category="selectedCategory = $event"
      />
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Filters -->
      <FilterBar :filters="filters" :selected-filters="selectedFilters" @filter-click="handleFilterClick" />

      <!-- Promotions Banner -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-uber-green to-uber-dark-green rounded-2xl p-8 text-white">
          <h2 class="text-3xl font-bold mb-2">Livraison gratuite</h2>
          <p class="text-lg mb-4">Sur les commandes de 15€ et plus</p>
          <button class="px-6 py-3 bg-white text-uber-green rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Profiter de l'offre
          </button>
        </div>
      </div>

      <!-- Restaurants Grid -->
      <div>
        <h2 class="text-2xl font-bold text-uber-text-dark mb-6">Restaurants à proximité</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RestaurantCard
            v-for="restaurant in filteredRestaurants"
            :key="restaurant._id"
            :restaurant="restaurant"
            @click="handleRestaurantClick"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import CategoryFilter from '@/components/CategoryFilter.vue'
  import FilterBar from '@/components/FilterBar.vue'
  import RestaurantCard from '@/components/RestaurantCard.vue'
  import UberButton from '@/components/UberButton.vue'
  import UberInput from '@/components/UberInput.vue'
  import { useAuthStore } from '@/stores/auth'
  import { useRestaurantsStore } from '@/stores/restaurants'

  const router = useRouter()
  const authStore = useAuthStore()
  const restaurantsStore = useRestaurantsStore()

  const address = ref('')
  const selectedCategory = ref('Tout')
  const selectedFilters = ref<string[]>([])

  // Initialize auth on mount
  onMounted(async () => {
    authStore.initAuth()
    await restaurantsStore.fetchRestaurants()
  })

  const categories = [
    { name: 'Tout', icon: '🍽️' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burger', icon: '🍔' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Pâtes', icon: '🍝' },
    { name: 'Végétarien', icon: '🥗' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Asiatique', icon: '🥡' },
  ]

  const filters = [
    'Livraison gratuite',
    'Moins de 30 min',
    'Offres',
    'Mieux notés',
  ]

  const categoryMapping: Record<string, string[]> = {
    Tout: [],
    Pizza: ['Italien'],
    Burger: ['Américain'],
    Sushi: ['Japonais'],
    Pâtes: ['Italien'],
    Végétarien: ['Healthy'],
    Desserts: [],
    Asiatique: ['Japonais', 'Asiatique'],
  }

  const filteredRestaurants = computed(() => {
    let result = [...restaurantsStore.restaurants]

    // Filtrage par catégorie
    if (selectedCategory.value !== 'Tout') {
      const categoriesToMatch = categoryMapping[selectedCategory.value] || []
      result = categoriesToMatch.length > 0
        ? result.filter(restaurant =>
          categoriesToMatch.includes(restaurant.category),
        )
        : []
    }

    // Filtrage par filtres multiples
    if (selectedFilters.value.length > 0) {
      result = result.filter(restaurant => {
        return selectedFilters.value.every(filter => {
          switch (filter) {
            case 'Livraison gratuite': {
              return restaurant.deliveryFee === 0
            }
            case 'Moins de 30 min': {
              return restaurant.time < 30
            }
            case 'Offres': {
              return restaurant.promo !== undefined
            }
            case 'Mieux notés': {
              return restaurant.rating >= 4.7
            }
            default: {
              return true
            }
          }
        })
      })
    }

    return result
  })

  function handleFilterClick (filter: string) {
    const index = selectedFilters.value.indexOf(filter)
    if (index === -1) {
      selectedFilters.value.push(filter)
    } else {
      selectedFilters.value.splice(index, 1)
    }
  }

  function handleRestaurantClick (restaurant: any) {
    console.log('Restaurant clicked:', restaurant)
  }

  function goToLogin () {
    router.push('/login')
  }

  function goToRegister () {
    router.push('/register')
  }

  function handleLogout () {
    authStore.logout()
  }
</script>
