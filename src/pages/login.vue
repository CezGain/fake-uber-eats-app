<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-uber-border">
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
          Bienvenue
        </h1>
        <p class="text-uber-text-gray mb-8">
          Connectez-vous ou créez un compte
        </p>

        <!-- Login Form -->
        <div class="space-y-4">
          <!-- Email Input -->
          <UberInput
            v-model="email"
            label="E-mail"
            placeholder="exemple@email.com"
            type="email"
          />

          <!-- Password Input (shown after email is entered) -->
          <UberInput
            v-if="showPassword"
            v-model="password"
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            type="password"
          />

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </div>

          <!-- Continue Button -->
          <UberButton :disabled="isLoading" @click="handleContinue">
            {{ isLoading ? 'Connexion...' : 'Continuer' }}
          </UberButton>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 border-t border-uber-border" />
            <span class="text-sm text-uber-text-gray">ou</span>
            <div class="flex-1 border-t border-uber-border" />
          </div>

          <!-- Social Login Buttons -->
          <SocialButton action="login" type="google" />
          <SocialButton action="login" type="apple" />
          <SocialButton action="login" type="facebook" />
        </div>

        <!-- Terms -->
        <p class="text-xs text-uber-text-gray mt-8 text-center">
          En continuant, vous acceptez les
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

  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const errorMessage = ref('')
  const isLoading = ref(false)

  async function handleContinue () {
    if (!email.value) {
      errorMessage.value = 'Veuillez entrer votre email'
      return
    }

    // Si pas de mot de passe, demander le mot de passe
    if (!showPassword.value) {
      showPassword.value = true
      return
    }

    if (!password.value) {
      errorMessage.value = 'Veuillez entrer votre mot de passe'
      return
    }

    try {
      isLoading.value = true
      errorMessage.value = ''

      const result = await authStore.login({
        email: email.value,
        password: password.value,
      })

      if (result.success) {
        router.push('/')
      } else {
        errorMessage.value = result.message
      }
    } catch {
      errorMessage.value = 'Une erreur est survenue lors de la connexion'
    } finally {
      isLoading.value = false
    }
  }

  function goHome () {
    router.push('/')
  }
</script>
