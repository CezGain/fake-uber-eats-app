<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-uber-text-dark mb-2">
      {{ label }}
    </label>
    <input
      :class="inputClasses"
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    modelValue: string
    type?: string
    label?: string
    placeholder?: string
    fullWidth?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    label: '',
    placeholder: '',
    fullWidth: true,
  })

  defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const inputClasses = computed(() => {
    return [
      props.fullWidth ? 'w-full' : 'flex-1',
      'px-4 py-3 border-2 border-uber-border rounded-lg',
      'focus:border-uber-green focus:outline-none transition-colors text-uber-black',
    ].join(' ')
  })
</script>
