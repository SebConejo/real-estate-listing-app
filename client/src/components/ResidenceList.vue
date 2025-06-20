<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Residence } from '../types/Residence'
import ResidenceCard from './ResidenceCard.vue'
import ResidenceFilters from './ResidenceFilters.vue'
import SearchBar from './SearchBar.vue'

interface ResidenceListProps {
  residences: Residence[]
}

interface FilterState {
  minPrice: number | null
  maxPrice: number | null
  city: string
  bedrooms: number | null
}

const props = defineProps<ResidenceListProps>()

const searchQuery = ref('')
const filters = ref<FilterState>({
  minPrice: null,
  maxPrice: null,
  city: '',
  bedrooms: null,
})

const availableCities = computed(() => {
  const cities = [...new Set(props.residences.map((r) => r.city))]
  return cities.sort()
})

const filteredResidences = computed(() => {
  let filtered = props.residences

  // Apply text search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (residence) =>
        residence.title.toLowerCase().includes(query) ||
        residence.location.toLowerCase().includes(query) ||
        residence.city.toLowerCase().includes(query) ||
        residence.description.toLowerCase().includes(query) ||
        residence.type.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (filters.value.minPrice !== null) {
    filtered = filtered.filter(
      (residence) => residence.price >= filters.value.minPrice!
    )
  }

  if (filters.value.maxPrice !== null) {
    filtered = filtered.filter(
      (residence) => residence.price <= filters.value.maxPrice!
    )
  }

  if (filters.value.city) {
    filtered = filtered.filter(
      (residence) => residence.city === filters.value.city
    )
  }

  if (filters.value.bedrooms !== null) {
    filtered = filtered.filter(
      (residence) => residence.bedrooms >= filters.value.bedrooms!
    )
  }

  return filtered
})

const updateFilters = (newFilters: FilterState) => {
  filters.value = newFilters
}

// Modal logic
const showModal = ref(false)
const selectedResidence = ref<Residence | null>(null)

// Contact form state
const contactName = ref('')
const contactEmail = ref('')
const contactMessage = ref('')
const contactError = ref('')
const contactSuccess = ref(false)
const contactLoading = ref(false)

function openModal(residence: Residence) {
  selectedResidence.value = residence
  showModal.value = true
  contactName.value = ''
  contactEmail.value = ''
  contactMessage.value = ''
  contactError.value = ''
  contactSuccess.value = false
}
function closeModal() {
  showModal.value = false
  setTimeout(() => {
    selectedResidence.value = null
  }, 300) // match transition duration
}

async function submitContactForm() {
  contactError.value = ''
  contactSuccess.value = false
  // Simple client-side validation
  if (!contactName.value.trim()) {
    contactError.value = 'Name is required.'
    return
  }
  if (
    !contactEmail.value.trim() ||
    !/^\S+@\S+\.\S+$/.test(contactEmail.value)
  ) {
    contactError.value = 'A valid email is required.'
    return
  }
  if (!contactMessage.value.trim()) {
    contactError.value = 'Message is required.'
    return
  }
  contactLoading.value = true
  try {
    const res = await fetch('http://localhost:1111/api/collections/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: contactName.value,
        email: contactEmail.value,
        message: contactMessage.value,
        residence: selectedResidence.value?.id,
      }),
    })
    if (!res.ok) throw new Error('Failed to send message')
    contactSuccess.value = true
    contactName.value = ''
    contactEmail.value = ''
    contactMessage.value = ''
  } catch (e: any) {
    contactError.value = e.message || 'Server error'
  } finally {
    contactLoading.value = false
  }
}
</script>

<template>
  <div class="residence-list-container">
    <div class="search-section">
      <SearchBar v-model="searchQuery" />
      <ResidenceFilters
        :filters="filters"
        :available-cities="availableCities"
        @update:filters="updateFilters"
      />
    </div>

    <div class="results-header">
      <h2 class="results-title">
        {{ filteredResidences.length }} Residences Found
      </h2>
      <p
        class="results-subtitle"
        v-if="
          searchQuery ||
          filters.minPrice ||
          filters.maxPrice ||
          filters.city ||
          filters.bedrooms
        "
      >
        <span v-if="searchQuery">Searching for "{{ searchQuery }}"</span>
        <span
          v-if="
            searchQuery &&
            (filters.minPrice ||
              filters.maxPrice ||
              filters.city ||
              filters.bedrooms)
          "
        >
          •
        </span>
        <span
          v-if="
            filters.minPrice ||
            filters.maxPrice ||
            filters.city ||
            filters.bedrooms
          "
        >
          Filtered results
        </span>
      </p>
    </div>

    <div v-if="filteredResidences.length > 0" class="residences-grid">
      <ResidenceCard
        v-for="residence in filteredResidences"
        :key="residence.id"
        :residence="residence"
        @click="openModal(residence)"
        style="cursor: pointer"
      />
    </div>

    <div v-else class="no-results">
      <div class="no-results-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <h3 class="no-results-title">No residences found</h3>
      <p class="no-results-text">
        Try adjusting your search criteria or filters to find more residences.
      </p>
    </div>

    <!-- Modal -->
    <transition name="modal-fade">
      <div
        v-if="showModal && selectedResidence"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">&times;</button>
          <img
            :src="selectedResidence.image.medium"
            :alt="selectedResidence.title"
            class="modal-image"
          />
          <h2 class="modal-title">{{ selectedResidence.title }}</h2>
          <div class="modal-price">
            ${{ selectedResidence.price.toLocaleString() }}
          </div>
          <div class="modal-location">
            {{ selectedResidence.location }}, {{ selectedResidence.city }}
          </div>
          <div class="modal-features">
            <span>{{ selectedResidence.bedrooms }} bed</span>
            <span>{{ selectedResidence.bathrooms }} bath</span>
            <span>{{ selectedResidence.surfaceArea }} m²</span>
            <span class="modal-type">{{ selectedResidence.type }}</span>
          </div>
          <p class="modal-description">{{ selectedResidence.description }}</p>

          <!-- Contact Form -->
          <form class="contact-form" @submit.prevent="submitContactForm">
            <h3>Contact the Agent</h3>
            <input
              v-model="contactName"
              type="text"
              placeholder="Your Name"
              required
            />
            <input
              v-model="contactEmail"
              type="email"
              placeholder="Your Email"
              required
            />
            <textarea
              v-model="contactMessage"
              placeholder="Your Message"
              required
              rows="4"
            ></textarea>
            <button type="submit" :disabled="contactLoading">
              {{ contactLoading ? 'Sending...' : 'Send Message' }}
            </button>
            <div v-if="contactError" class="form-error">{{ contactError }}</div>
            <div v-if="contactSuccess" class="form-success">
              Message sent successfully!
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.residence-list-container {
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

.residences-grid {
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
  .residence-list-container {
    padding: 0 16px;
  }

  .residences-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .results-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .residences-grid {
    gap: 20px;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 24, 39, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background 0.3s;
}
.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  padding: 32px 32px 24px 32px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: modal-pop 0.3s cubic-bezier(0.4, 2, 0.6, 1) both;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-close {
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #2563eb;
}
.modal-image {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  margin-bottom: 24px;
  object-fit: cover;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
  text-align: center;
}
.modal-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 8px;
  text-align: center;
}
.modal-location {
  color: #6b7280;
  margin-bottom: 16px;
  text-align: center;
}
.modal-features {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 16px;
  color: #374151;
  font-weight: 500;
}
.modal-type {
  background: #2563eb;
  color: white;
  border-radius: 12px;
  padding: 2px 12px;
  font-size: 0.9rem;
  margin-left: 8px;
}
.modal-description {
  color: #374151;
  font-size: 1.1rem;
  margin-top: 8px;
  text-align: center;
}

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
@keyframes modal-pop {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.contact-form {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.contact-form input,
.contact-form textarea {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  resize: none;
}
.contact-form button {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.contact-form button:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}
.form-error {
  color: #dc2626;
  font-size: 0.95rem;
  margin-top: 4px;
}
.form-success {
  color: #16a34a;
  font-size: 0.95rem;
  margin-top: 4px;
}
</style>
