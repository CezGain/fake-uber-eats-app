<template>
  <button
    :class="buttonClasses"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    variant?: 'primary' | 'secondary'
    fullWidth?: boolean
    type?: 'button' | 'submit' | 'reset'
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    fullWidth: true,
    type: 'button',
  })

  defineEmits<{
    click: [event: MouseEvent]
  }>()

  const buttonClasses = computed(() => {
    const base = 'font-semibold py-3 px-4 rounded-lg transition-colors'
    const width = props.fullWidth ? 'w-full' : ''

    const variants = {
      primary: 'bg-uber-green hover:bg-uber-dark-green text-white',
      secondary: 'border-2 border-uber-border hover:bg-uber-light-gray bg-white text-uber-text-dark',
    }

    return `${base} ${width} ${variants[props.variant]}`
  })
</script>
