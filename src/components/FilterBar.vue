<template>
  <div class="flex gap-3 mb-8 overflow-x-auto pb-2">
    <button
      v-for="filter in filters"
      :key="filter"
      :class="[
        'px-4 py-2 border-2 rounded-full transition-colors whitespace-nowrap font-medium text-sm',
        selectedFilters.includes(filter)
          ? 'bg-uber-green text-white border-uber-green'
          : 'bg-white text-uber-black border-uber-border hover:border-uber-green'
      ]"
      @click="$emit('filter-click', filter)"
    >
      {{ filter }}
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    filters: string[]
    selectedFilters: string[]
  }

  defineProps<Props>()

  defineEmits<{
    'filter-click': [filter: string]
  }>()
</script>
