<script setup lang="ts">
interface FilterState {
  minPrice: number | null
  maxPrice: number | null
  city: string
  bedrooms: number | null
}

interface ResidenceFiltersProps {
  filters: FilterState
  availableCities: string[]
}

interface ResidenceFiltersEmits {
  (e: 'update:filters', filters: FilterState): void
}

const props = defineProps<ResidenceFiltersProps>()
const emit = defineEmits<ResidenceFiltersEmits>()

const updateFilter = (key: keyof FilterState, value: any) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

const resetFilters = () => {
  emit('update:filters', {
    minPrice: null,
    maxPrice: null,
    city: '',
    bedrooms: null,
  })
}
</script>

<template>
  <div class="filters-container">
    <h3 class="filters-title">Filters</h3>

    <div class="filters-grid">
      <div class="filter-group">
        <label class="filter-label">Min Price</label>
        <input
          type="number"
          :value="filters.minPrice || ''"
          @input="
            updateFilter(
              'minPrice',
              ($event.target as HTMLInputElement).value
                ? Number(($event.target as HTMLInputElement).value)
                : null
            )
          "
          placeholder="0"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Max Price</label>
        <input
          type="number"
          :value="filters.maxPrice || ''"
          @input="
            updateFilter(
              'maxPrice',
              ($event.target as HTMLInputElement).value
                ? Number(($event.target as HTMLInputElement).value)
                : null
            )
          "
          placeholder="No limit"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">City</label>
        <select
          :value="filters.city"
          @change="
            updateFilter('city', ($event.target as HTMLSelectElement).value)
          "
          class="filter-select"
        >
          <option value="">All Cities</option>
          <option v-for="city in availableCities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Bedrooms</label>
        <select
          :value="filters.bedrooms || ''"
          @change="
            updateFilter(
              'bedrooms',
              ($event.target as HTMLSelectElement).value
                ? Number(($event.target as HTMLSelectElement).value)
                : null
            )
          "
          class="filter-select"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
    </div>

    <button @click="resetFilters" class="reset-button">Reset Filters</button>
  </div>
</template>

<style scoped>
.filters-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.filters-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.filter-input,
.filter-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s ease;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.reset-button {
  padding: 10px 20px;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

@media (max-width: 640px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
