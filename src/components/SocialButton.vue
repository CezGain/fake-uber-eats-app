<template>
  <UberButton :full-width="fullWidth" variant="secondary" @click="$emit('click', $event)">
    <div class="flex items-center justify-center gap-3">
      <!-- Icons -->
      <GoogleLogo v-if="type === 'google'" />
      <AppleLogo v-if="type === 'apple'" />
      <FacebookLogo v-if="type === 'facebook'" />

      <!-- Text -->
      <span class="font-medium">{{ buttonText }}</span>
    </div>
  </UberButton>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import AppleLogo from './icons/AppleLogo.vue'
  import FacebookLogo from './icons/FacebookLogo.vue'
  import GoogleLogo from './icons/GoogleLogo.vue'
  import UberButton from './UberButton.vue'

  interface Props {
    type: 'google' | 'apple' | 'facebook'
    action?: 'login' | 'register'
    fullWidth?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    action: 'login',
    fullWidth: true,
  })

  defineEmits<{
    click: [event: MouseEvent]
  }>()

  const buttonText = computed(() => {
    const texts = {
      google: {
        login: 'Continuer avec Google',
        register: 'S\'inscrire avec Google',
      },
      apple: {
        login: 'Continuer avec Apple',
        register: 'S\'inscrire avec Apple',
      },
      facebook: {
        login: 'Continuer avec Facebook',
        register: 'S\'inscrire avec Facebook',
      },
    }

    return texts[props.type][props.action]
  })
</script>
