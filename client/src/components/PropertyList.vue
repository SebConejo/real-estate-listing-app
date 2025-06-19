<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Property } from '../types/Property';
import PropertyCard from './PropertyCard.vue';
import SearchBar from './SearchBar.vue';
import PropertyFilters from './PropertyFilters.vue';

interface PropertyListProps {
  properties: Property[];
}

interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  city: string;
  bedrooms: number | null;
}

const props = defineProps<PropertyListProps>();

const searchQuery = ref('');
const filters = ref<FilterState>({
  minPrice: null,
  maxPrice: null,
  city: '',
  bedrooms: null
});

const availableCities = computed(() => {
  const cities = [...new Set(props.properties.map(p => p.city))];
  return cities.sort();
});

const filteredProperties = computed(() => {
  let filtered = props.properties;

  // Apply text search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(property =>
      property.title.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      property.city.toLowerCase().includes(query) ||
      property.description.toLowerCase().includes(query) ||
      property.type.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.minPrice !== null) {
    filtered = filtered.filter(property => property.price >= filters.value.minPrice!);
  }

  if (filters.value.maxPrice !== null) {
    filtered = filtered.filter(property => property.price <= filters.value.maxPrice!);
  }

  if (filters.value.city) {
    filtered = filtered.filter(property => property.city === filters.value.city);
  }

  if (filters.value.bedrooms !== null) {
    filtered = filtered.filter(property => property.bedrooms >= filters.value.bedrooms!);
  }

  return filtered;
});

const updateFilters = (newFilters: FilterState) => {
  filters.value = newFilters;
};
</script>

<template>
  <div class="property-list-container">
    <div class="search-section">
      <SearchBar v-model="searchQuery" />
      <PropertyFilters 
        :filters="filters" 
        :available-cities="availableCities"
        @update:filters="updateFilters"
      />
    </div>

    <div class="results-header">
      <h2 class="results-title">
        {{ filteredProperties.length }} Properties Found
      </h2>
      <p class="results-subtitle" v-if="searchQuery || filters.minPrice || filters.maxPrice || filters.city || filters.bedrooms">
        <span v-if="searchQuery">Searching for "{{ searchQuery }}"</span>
        <span v-if="searchQuery && (filters.minPrice || filters.maxPrice || filters.city || filters.bedrooms)"> • </span>
        <span v-if="filters.minPrice || filters.maxPrice || filters.city || filters.bedrooms">
          Filtered results
        </span>
      </p>
    </div>

    <div v-if="filteredProperties.length > 0" class="properties-grid">
      <PropertyCard 
        v-for="property in filteredProperties"
        :key="property.id"
        :property="property"
      />
    </div>

    <div v-else class="no-results">
      <div class="no-results-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <h3 class="no-results-title">No properties found</h3>
      <p class="no-results-text">
        Try adjusting your search criteria or filters to find more properties.
      </p>
    </div>
  </div>
</template>

<style scoped>
.property-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-section {
  margin-bottom: 32px;
}

.results-header {
  margin-bottom: 32px;
  text-align: center;
}

.results-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.results-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 64px;
}

.no-results {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.no-results-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  color: #d1d5db;
}

.no-results-icon svg {
  width: 100%;
  height: 100%;
}

.no-results-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.no-results-text {
  font-size: 16px;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .property-list-container {
    padding: 0 16px;
  }
  
  .properties-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .results-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .properties-grid {
    gap: 20px;
  }
}
</style>