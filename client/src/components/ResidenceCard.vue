<script setup lang="ts">
import type { Residence } from '../types/Residence'

interface ResidenceCardProps {
  residence: Residence
}

defineProps<ResidenceCardProps>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <div class="residence-card">
    <div class="residence-image-container">
      <img
        :src="residence.image.medium"
        :alt="residence.title"
        class="residence-image"
        loading="lazy"
      />
      <div class="residence-type-badge">{{ residence.type }}</div>
    </div>

    <div class="residence-content">
      <div class="residence-header">
        <h3 class="residence-title">{{ residence.title }}</h3>
        <div class="residence-price">{{ formatPrice(residence.price) }}</div>
      </div>

      <div class="residence-location">
        <svg
          class="location-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <span>{{ residence.location }}</span>
      </div>

      <div class="residence-features">
        <div class="feature">
          <svg
            class="feature-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 21l8-12"
            ></path>
          </svg>
          <span>
            {{ residence.bedrooms }} bed{{
              residence.bedrooms !== 1 ? 's' : ''
            }}
          </span>
        </div>

        <div class="feature">
          <svg
            class="feature-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v6m0 0l3-3m-3 3L9 7"
            ></path>
          </svg>
          <span>
            {{ residence.bathrooms }} bath{{
              residence.bathrooms !== 1 ? 's' : ''
            }}
          </span>
        </div>

        <div class="feature">
          <svg
            class="feature-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            ></path>
          </svg>
          <span>{{ residence.surfaceArea }} m²</span>
        </div>
      </div>

      <p class="residence-description">{{ residence.description }}</p>

      <button class="view-details-button">View Details</button>
    </div>
  </div>
</template>

<style scoped>
.residence-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.residence-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.residence-image-container {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.residence-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.residence-card:hover .residence-image {
  transform: scale(1.05);
}

.residence-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(37, 99, 235, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.residence-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.residence-header {
  margin-bottom: 12px;
}

.residence-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.residence-price {
  font-size: 24px;
  font-weight: 800;
  color: #2563eb;
}

.residence-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.location-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.residence-features {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.feature-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.residence-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.view-details-button {
  width: 100%;
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: auto;
}

.view-details-button:hover {
  background-color: #1d4ed8;
}

@media (max-width: 480px) {
  .residence-features {
    gap: 12px;
  }

  .residence-content {
    padding: 20px 16px;
  }
}
</style>
