<template>
  <div class="space-y-8">
    <!-- Bienvenida -->
    <div class="card bg-gradient-primary">
      <h2 class="text-3xl font-display font-bold text-white mb-2">
        ¡Bienvenido, {{ authStore.usuario?.nombre }}!
      </h2>
      <p class="text-white/90">
        Gestiona tus citas y pedidos desde aquí
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link to="/agendar" class="card hover:shadow-glow-lg transition-all group">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarPlus class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 class="text-white font-semibold">Agendar Cita</h3>
            <p class="text-gray-400 text-sm">Reserva tu próximo corte</p>
          </div>
        </div>
      </router-link>

      <router-link to="/productos" class="card hover:shadow-glow-lg transition-all group">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingCart class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 class="text-white font-semibold">Ver Productos</h3>
            <p class="text-gray-400 text-sm">Explora nuestro catálogo</p>
          </div>
        </div>
      </router-link>

      <router-link to="/servicios" class="card hover:shadow-glow-lg transition-all group">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scissors class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 class="text-white font-semibold">Ver Servicios</h3>
            <p class="text-gray-400 text-sm">Conoce nuestros servicios</p>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Citas Próximas</p>
            <p class="text-3xl font-bold text-white">{{ citasProximas.length }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Pedidos Activos</p>
            <p class="text-3xl font-bold text-white">{{ pedidosActivos.length }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Package class="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Total Gastado</p>
            <p class="text-3xl font-bold text-white">${{ totalGastado.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Próximas Citas -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-display font-bold text-white">Próximas Citas</h3>
        <router-link to="/agendar" class="text-primary-500 hover:text-primary-400 text-sm font-semibold">
          Agendar Nueva
        </router-link>
      </div>

      <div v-if="loadingCitas" class="flex justify-center py-8">
        <Loader2 class="w-8 h-8 text-primary-500 animate-spin" />
      </div>

      <div v-else-if="citasProximas.length > 0" class="space-y-4">
        <div
          v-for="cita in citasProximas.slice(0, 3)"
          :key="cita._id"
          class="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h4 class="text-white font-semibold mb-1">
                {{ cita.servicioId?.nombre || 'Servicio' }}
              </h4>
              <div class="flex items-center space-x-4 text-sm text-gray-400">
                <span class="flex items-center">
                  <Calendar class="w-4 h-4 mr-1" />
                  {{ formatDate(cita.fecha) }}
                </span>
                <span class="flex items-center">
                  <Clock class="w-4 h-4 mr-1" />
                  {{ cita.hora }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                getEstadoClass(cita.estado)
              ]">
                {{ cita.estado }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <Calendar class="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p class="text-gray-400">No tienes citas próximas</p>
        <router-link to="/agendar" class="text-primary-500 hover:text-primary-400 text-sm">
          Agenda tu primera cita
        </router-link>
      </div>
    </div>

    <!-- Pedidos Recientes -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-display font-bold text-white">Pedidos Recientes</h3>
        <router-link to="/productos" class="text-primary-500 hover:text-primary-400 text-sm font-semibold">
          Ver Productos
        </router-link>
      </div>

      <div v-if="loadingPedidos" class="flex justify-center py-8">
        <Loader2 class="w-8 h-8 text-primary-500 animate-spin" />
      </div>

      <div v-else-if="pedidosRecientes.length > 0" class="space-y-4">
        <div
          v-for="pedido in pedidosRecientes.slice(0, 3)"
          :key="pedido._id"
          class="bg-dark-700 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-white font-semibold">Pedido #{{ pedido.numeroPedido }}</span>
            <span :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              getEstadoClass(pedido.estado)
            ]">
              {{ pedido.estado }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-400">
            <span>{{ formatDate(pedido.createdAt) }}</span>
            <span class="text-primary-500 font-bold">${{ pedido.total.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <Package class="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p class="text-gray-400">No tienes pedidos</p>
        <router-link to="/productos" class="text-primary-500 hover:text-primary-400 text-sm">
          Explora nuestros productos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { citasAPI, pedidosAPI } from '@/services/api'
import {
  Calendar,
  CalendarPlus,
  Clock,
  Package,
  Scissors,
  ShoppingCart,
  DollarSign,
  Loader2
} from 'lucide-vue-next'

const authStore = useAuthStore()

const citas = ref([])
const pedidos = ref([])
const loadingCitas = ref(true)
const loadingPedidos = ref(true)

const citasProximas = computed(() => {
  const hoy = new Date()
  return citas.value
    .filter(c => c.estado === 'confirmada' && new Date(c.fecha) >= hoy)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
})

const pedidosActivos = computed(() => {
  return pedidos.value.filter(p => ['pendiente', 'procesando', 'enviado'].includes(p.estado))
})

const pedidosRecientes = computed(() => {
  return [...pedidos.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const totalGastado = computed(() => {
  return pedidos.value
    .filter(p => p.estado === 'entregado')
    .reduce((sum, p) => sum + p.total, 0)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getEstadoClass = (estado) => {
  const classes = {
    confirmada: 'bg-green-500/20 text-green-500',
    pendiente: 'bg-yellow-500/20 text-yellow-500',
    procesando: 'bg-blue-500/20 text-blue-500',
    enviado: 'bg-purple-500/20 text-purple-500',
    entregado: 'bg-green-500/20 text-green-500',
    cancelada: 'bg-red-500/20 text-red-500',
    cancelado: 'bg-red-500/20 text-red-500'
  }
  return classes[estado] || 'bg-gray-500/20 text-gray-500'
}

const cargarCitas = async () => {
  try {
    loadingCitas.value = true
    const { data } = await citasAPI.obtenerMisCitas()
    citas.value = data
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    loadingCitas.value = false
  }
}

const cargarPedidos = async () => {
  try {
    loadingPedidos.value = true
    const { data } = await pedidosAPI.obtenerMisPedidos()
    pedidos.value = data
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
  } finally {
    loadingPedidos.value = false
  }
}

onMounted(() => {
  cargarCitas()
  cargarPedidos()
})
</script>
