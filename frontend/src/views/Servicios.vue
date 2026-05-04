<template>
  <div class="min-h-screen py-20">
    <div class="container-custom">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-4">
          Nuestros Servicios
        </h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Servicios profesionales de barbería con los más altos estándares de calidad
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="w-12 h-12 text-primary-500 animate-spin" />
      </div>

      <!-- Servicios Grid -->
      <div v-else-if="servicios.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="servicio in servicios" 
          :key="servicio._id"
          class="card hover:shadow-glow-lg transition-all duration-300 group"
        >
          <!-- Icono según tipo de servicio -->
          <div class="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <component 
              :is="getServiceIcon(servicio.nombre)" 
              class="w-8 h-8 text-white" 
            />
          </div>

          <h3 class="text-2xl font-display font-bold text-white mb-3">
            {{ servicio.nombre }}
          </h3>

          <p class="text-gray-400 mb-4 min-h-[60px]">
            {{ servicio.descripcion }}
          </p>

          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-primary-500 font-bold text-2xl">
                ${{ servicio.precio.toLocaleString() }}
              </p>
              <p class="text-gray-500 text-sm">COP</p>
            </div>
            <div class="text-right">
              <div class="flex items-center text-gray-400">
                <Clock class="w-4 h-4 mr-1" />
                <span class="text-sm">{{ servicio.duracion }} min</span>
              </div>
            </div>
          </div>

          <router-link 
            to="/agendar"
            class="w-full btn-primary text-center"
          >
            <div class="flex items-center justify-center space-x-2">
              <Calendar class="w-5 h-5" />
              <span>Agendar Ahora</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <Scissors class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">No hay servicios disponibles en este momento</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { serviciosAPI } from '@/services/api'
import { 
  Scissors, 
  Sparkles, 
  Crown, 
  Clock, 
  Calendar, 
  Loader2,
  Zap
} from 'lucide-vue-next'

const servicios = ref([])
const loading = ref(true)

const getServiceIcon = (nombre) => {
  const nombreLower = nombre.toLowerCase()
  if (nombreLower.includes('barba')) return Sparkles
  if (nombreLower.includes('royal') || nombreLower.includes('premium') || nombreLower.includes('paquete')) return Crown
  if (nombreLower.includes('niño')) return Zap
  return Scissors
}

const cargarServicios = async () => {
  try {
    loading.value = true
    const { data } = await serviciosAPI.obtenerTodos()
    servicios.value = data.filter(s => s.activo)
  } catch (error) {
    console.error('Error al cargar servicios:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarServicios()
})
</script>
