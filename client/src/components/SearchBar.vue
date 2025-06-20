<script setup lang="ts">
import { ref } from 'vue'

interface SearchBarProps {
  modelValue: string
}

interface SearchBarEmits {
  (e: 'update:modelValue', value: string): void
}

defineProps<SearchBarProps>()
defineEmits<SearchBarEmits>()

const searchInput = ref<HTMLInputElement | null>(null)

const focusSearch = () => {
  searchInput.value?.focus()
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-container">
      <svg
        class="search-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
      <input
        ref="searchInput"
        type="text"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        placeholder="Search residencies by title, location, or description..."
        class="search-input"
      />
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  margin-bottom: 24px;
}

.search-input-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #6b7280;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}
</style>
