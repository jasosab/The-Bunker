<template>
  <div id="app" class="min-h-screen bg-dark-900">
    <Navbar v-if="!isDashboardRoute" />
    <main>
      <router-view />
    </main>
    <Footer v-if="!isDashboardRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Layout/Navbar.vue'
import Footer from '@/components/Layout/Footer.vue'

const route = useRoute()

const isDashboardRoute = computed(() => {
  return route.path.startsWith('/dashboard')
})
</script>

<style>
/* Estilos globales adicionales si son necesarios */
</style>
