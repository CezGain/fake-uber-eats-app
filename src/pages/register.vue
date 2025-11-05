<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-uber-border">
      <button class="text-uber-text-gray hover:text-uber-text-dark" @click="goBack">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </button>
      <button class="flex items-center gap-2 hover:opacity-80 transition-opacity" @click="goHome">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="#06c167" />
        </svg>
        <span class="text-2xl font-bold text-uber-text-dark">UberEats</span>
      </button>
      <button class="text-uber-text-gray hover:text-uber-text-dark">
        Aide
      </button>
    </header>

    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center px-6 py-12">
      <div class="w-full max-w-md">
        <h1 class="text-4xl font-bold text-uber-text-dark mb-2">
          Créer un compte
        </h1>
        <p class="text-uber-text-gray mb-8">
          Entrez vos informations pour commencer
        </p>

        <!-- Registration Form -->
        <div class="space-y-4">
          <!-- First Name -->
          <UberInput
            v-model="form.firstName"
            label="Prénom"
            placeholder="Entrez votre prénom"
            type="text"
          />

          <!-- Last Name -->
          <UberInput
            v-model="form.lastName"
            label="Nom"
            placeholder="Entrez votre nom"
            type="text"
          />

          <!-- Email -->
          <UberInput
            v-model="form.email"
            label="E-mail"
            placeholder="exemple@email.com"
            type="email"
          />

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-uber-text-dark mb-2">
              Numéro de téléphone
            </label>
            <div class="flex gap-2">
              <select class="px-4 py-3 border-2 border-uber-border rounded-lg focus:border-uber-green focus:outline-none transition-colors text-uber-black">
                <option>+33</option>
                <option>+1</option>
                <option>+44</option>
              </select>
              <UberInput
                v-model="form.phone"
                :full-width="false"
                placeholder="06 12 34 56 78"
                type="tel"
              />
            </div>
          </div>

          <!-- Password -->
          <UberInput
            v-model="form.password"
            label="Mot de passe"
            placeholder="Minimum 8 caractères"
            type="password"
          />

          <!-- Marketing Consent -->
          <div class="flex items-center gap-3">
            <input
              id="marketing-checkbox"
              v-model="form.marketing"
              class="w-5 h-5 cursor-pointer"
              type="checkbox"
            >
            <label class="text-sm text-uber-text-gray cursor-pointer" for="marketing-checkbox">
              Recevoir des offres promotionnelles et des actualités par e-mail
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <UberButton class="mt-6" :disabled="isLoading" @click="handleRegister">
            {{ isLoading ? 'Création...' : 'Créer un compte' }}
          </UberButton>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 border-t border-uber-border" />
            <span class="text-sm text-uber-text-gray">ou</span>
            <div class="flex-1 border-t border-uber-border" />
          </div>

          <!-- Social Registration -->
          <SocialButton action="register" type="google" />
        </div>

        <!-- Login Link -->
        <p class="text-sm text-uber-text-gray mt-8 text-center">
          Vous avez déjà un compte ?
          <router-link class="text-uber-green font-medium hover:underline" to="/login">
            Se connecter
          </router-link>
        </p>

        <!-- Terms -->
        <p class="text-xs text-uber-text-gray mt-6 text-center">
          En vous inscrivant, vous acceptez les
          <a class="underline hover:text-uber-text-dark" href="#">Conditions générales</a>
          et la
          <a class="underline hover:text-uber-text-dark" href="#">Politique de confidentialité</a>
          d'Uber.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import SocialButton from '@/components/SocialButton.vue'
  import UberButton from '@/components/UberButton.vue'
  import UberInput from '@/components/UberInput.vue'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    marketing: false,
  })

  const errorMessage = ref('')
  const isLoading = ref(false)

  async function handleRegister () {
    // Validation
    if (!form.value.firstName || !form.value.lastName) {
      errorMessage.value = 'Veuillez renseigner votre nom et prénom'
      return
    }

    if (!form.value.email) {
      errorMessage.value = 'Veuillez renseigner votre email'
      return
    }

    if (!form.value.password || form.value.password.length < 8) {
      errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
      return
    }

    try {
      isLoading.value = true
      errorMessage.value = ''

      const result = await authStore.register({
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        password: form.value.password,
        marketing: form.value.marketing,
      })

      if (result.success) {
        router.push('/')
      } else {
        errorMessage.value = result.message
      }
    } catch {
      errorMessage.value = 'Une erreur est survenue lors de l\'inscription'
    } finally {
      isLoading.value = false
    }
  }

  function goBack () {
    router.back()
  }

  function goHome () {
    router.push('/')
  }
</script>

<style scoped>
  #marketing-checkbox {
    appearance: none;
    background-color: white;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    display: inline-block;
    position: relative;
  }

  #marketing-checkbox:checked {
    background-color: #06c167;
    border-color: #06c167;
  }

  #marketing-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  #marketing-checkbox:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(6, 193, 103, 0.2);
  }
</style>
