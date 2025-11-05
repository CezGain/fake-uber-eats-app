<template>
  <div class="max-w-7xl mx-auto px-6 py-4 overflow-x-auto">
    <div class="flex gap-6">
      <button
        v-for="category in categories"
        :key="category.name"
        :class="[
          'flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap',
          selectedCategory === category.name
            ? 'bg-uber-light-green'
            : 'hover:bg-uber-light-gray',
        ]"
        @click="$emit('update:selectedCategory', category.name)"
      >
        <span class="text-2xl">{{ category.icon }}</span>
        <span class="text-sm font-medium text-uber-text-dark">{{ category.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Category {
    name: string
    icon: string
  }

  interface Props {
    categories: Category[]
    selectedCategory: string
  }

  defineProps<Props>()

  defineEmits<{
    'update:selectedCategory': [value: string]
  }>()
</script>
