<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ResidenceList from './components/ResidenceList.vue'

import Manifest from '@mnfst/sdk'
import type { Residence } from '../types/Residence'

// Initialisation avec l'URL par défaut (localhost:1111)
const manifest = new Manifest()

const residences = ref<Residence[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await manifest.from('residences').find({ perPage: 100 })
    residences.value = res.data
  } catch (e: any) {
    error.value = e.message || 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L3 12v18h10v-8h6v8h10V12L16 2z" fill="#2563eb" />
            </svg>
          </div>
          <h1 class="app-title">RealEstate</h1>
        </div>
        <nav class="main-nav">
          <a href="#" class="nav-link active">Residences</a>
          <a href="#" class="nav-link">About</a>
          <a href="#" class="nav-link">Contact</a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="hero-section">
        <h2 class="hero-title">Find Your Perfect Home</h2>
        <p class="hero-description">
          Discover exceptional residences in prime locations with our curated
          selection of homes, apartments, and luxury estates.
        </p>
      </div>

      <div v-if="loading" class="loading">Loading residences...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <ResidenceList v-else :residences="residences" />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">RealEstate</h3>
          <p class="footer-text">
            Your trusted partner in finding the perfect residence.
          </p>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">Contact</h4>
          <p class="footer-text">info@realestate.com</p>
          <p class="footer-text">(555) 123-4567</p>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">Follow Us</h4>
          <div class="social-links">
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 RealEstate. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #2563eb;
}

.main-content {
  flex: 1;
  padding: 40px 0;
}

.hero-section {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 64px;
  padding: 0 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 16px 0;
  line-height: 1.1;
}

.hero-description {
  font-size: 20px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.app-footer {
  background: #111827;
  color: white;
  margin-top: 80px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 20px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.footer-subtitle {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #d1d5db;
}

.footer-text {
  color: #9ca3af;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-link:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding: 24px 20px;
  text-align: center;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-bottom p {
  color: #9ca3af;
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    height: 70px;
  }

  .app-title {
    font-size: 20px;
  }

  .main-nav {
    gap: 20px;
  }

  .nav-link {
    font-size: 14px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-description {
    font-size: 18px;
  }

  .footer-content {
    padding: 40px 16px 20px;
    gap: 32px;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 16px;
    gap: 16px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-description {
    font-size: 16px;
  }

  .main-nav {
    gap: 16px;
  }
}
</style>
