<template>
  <div class="space-y-8">
    <!-- Bienvenida -->
    <div class="card bg-gradient-primary">
      <h2 class="text-3xl font-display font-bold text-white mb-2">
        Panel de Administración
      </h2>
      <p class="text-white/90">
        Vista general de TheBunker
      </p>
    </div>

    <!-- Estadísticas Principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-400 text-sm mb-1">Citas Hoy</p>
            <p class="text-3xl font-bold text-white">{{ stats.citasHoy }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-primary-500" />
          </div>
        </div>
        <div class="flex items-center text-sm">
          <TrendingUp class="w-4 h-4 text-green-500 mr-1" />
          <span class="text-green-500">+12%</span>
          <span class="text-gray-500 ml-1">vs ayer</span>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-400 text-sm mb-1">Ingresos Mes</p>
            <p class="text-3xl font-bold text-white">${{ (stats.ingresosMes / 1000).toFixed(0) }}K</p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div class="flex items-center text-sm">
          <TrendingUp class="w-4 h-4 text-green-500 mr-1" />
          <span class="text-green-500">+8%</span>
          <span class="text-gray-500 ml-1">vs mes anterior</span>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-400 text-sm mb-1">Clientes Activos</p>
            <p class="text-3xl font-bold text-white">{{ stats.clientesActivos }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div class="flex items-center text-sm">
          <TrendingUp class="w-4 h-4 text-green-500 mr-1" />
          <span class="text-green-500">+15</span>
          <span class="text-gray-500 ml-1">esta semana</span>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-400 text-sm mb-1">Productos Vendidos</p>
            <p class="text-3xl font-bold text-white">{{ stats.productosVendidos }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Package class="w-6 h-6 text-purple-500" />
          </div>
        </div>
        <div class="flex items-center text-sm">
          <TrendingUp class="w-4 h-4 text-green-500 mr-1" />
          <span class="text-green-500">+23%</span>
          <span class="text-gray-500 ml-1">vs semana anterior</span>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div>
      <h3 class="text-2xl font-display font-bold text-white mb-6">Acciones Rápidas</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button class="card hover:shadow-glow-lg transition-all group text-left">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarPlus class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h4 class="text-white font-semibold">Nueva Cita</h4>
              <p class="text-gray-400 text-sm">Agendar para cliente</p>
            </div>
          </div>
        </button>

        <button class="card hover:shadow-glow-lg transition-all group text-left">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h4 class="text-white font-semibold">Nuevo Cliente</h4>
              <p class="text-gray-400 text-sm">Registrar cliente</p>
            </div>
          </div>
        </button>

        <button class="card hover:shadow-glow-lg transition-all group text-left">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <PackagePlus class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h4 class="text-white font-semibold">Nuevo Producto</h4>
              <p class="text-gray-400 text-sm">Agregar inventario</p>
            </div>
          </div>
        </button>

        <button class="card hover:shadow-glow-lg transition-all group text-left">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scissors class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h4 class="text-white font-semibold">Nuevo Servicio</h4>
              <p class="text-gray-400 text-sm">Agregar servicio</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Citas Recientes y Próximas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Próximas Citas -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-display font-bold text-white">Próximas Citas</h3>
          <button @click="cargarCitas" class="text-primary-500 hover:text-primary-400">
            <RefreshCw :class="['w-5 h-5', loadingCitas && 'animate-spin']" />
          </button>
        </div>

        <div v-if="loadingCitas" class="flex justify-center py-8">
          <Loader2 class="w-8 h-8 text-primary-500 animate-spin" />
        </div>

        <div v-else-if="proximasCitas.length > 0" class="space-y-3">
          <div
            v-for="cita in proximasCitas.slice(0, 5)"
            :key="cita._id"
            class="bg-dark-700 rounded-lg p-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-white font-semibold text-sm">
                  {{ cita.clienteId?.nombre }} {{ cita.clienteId?.apellido }}
                </p>
                <p class="text-gray-400 text-xs">{{ cita.servicioId?.nombre }}</p>
              </div>
              <div class="text-right">
                <p class="text-primary-500 font-semibold text-sm">{{ cita.hora }}</p>
                <p class="text-gray-500 text-xs">{{ formatDate(cita.fecha) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <Calendar class="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p class="text-gray-400">No hay citas próximas</p>
        </div>
      </div>

      <!-- Productos con Stock Bajo -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-display font-bold text-white">Stock Bajo</h3>
          <button @click="cargarProductos" class="text-primary-500 hover:text-primary-400">
            <RefreshCw :class="['w-5 h-5', loadingProductos && 'animate-spin']" />
          </button>
        </div>

        <div v-if="loadingProductos" class="flex justify-center py-8">
          <Loader2 class="w-8 h-8 text-primary-500 animate-spin" />
        </div>

        <div v-else-if="productosStockBajo.length > 0" class="space-y-3">
          <div
            v-for="producto in productosStockBajo"
            :key="producto._id"
            class="bg-dark-700 rounded-lg p-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-white font-semibold text-sm">{{ producto.nombre }}</p>
                <p class="text-gray-400 text-xs">{{ producto.categoria }}</p>
              </div>
              <div class="text-right">
                <p :class="[
                  'font-bold text-sm',
                  producto.stock === 0 ? 'text-red-500' : 'text-yellow-500'
                ]">
                  Stock: {{ producto.stock }}
                </p>
                <p class="text-gray-500 text-xs">${{ producto.precio.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <Package class="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p class="text-gray-400">Stock en buen estado</p>
        </div>
      </div>
    </div>

    <!-- Servicios Populares -->
    <div class="card">
      <h3 class="text-2xl font-display font-bold text-white mb-6">Servicios Más Solicitados</h3>
      <div class="space-y-4">
        <div
          v-for="(servicio, index) in serviciosPopulares"
          :key="servicio._id"
          class="flex items-center space-x-4"
        >
          <div class="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
            <span class="text-primary-500 font-bold text-sm">{{ index + 1 }}</span>
          </div>
          <div class="flex-1">
            <p class="text-white font-semibold">{{ servicio.nombre }}</p>
            <p class="text-gray-400 text-sm">{{ servicio.descripcion }}</p>
          </div>
          <div class="text-right">
            <p class="text-primary-500 font-bold">${{ servicio.precio.toLocaleString() }}</p>
            <p class="text-gray-400 text-sm">{{ servicio.duracion }} min</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { citasAPI, productosAPI, serviciosAPI } from '@/services/api'
import {
  Calendar,
  CalendarPlus,
  Clock,
  Users,
  UserPlus,
  Package,
  PackagePlus,
  Scissors,
  DollarSign,
  TrendingUp,
  Loader2,
  RefreshCw
} from 'lucide-vue-next'

const citas = ref([])
const productos = ref([])
const servicios = ref([])
const loadingCitas = ref(true)
const loadingProductos = ref(true)

const stats = ref({
  citasHoy: 0,
  ingresosMes: 0,
  clientesActivos: 0,
  productosVendidos: 0
})

const proximasCitas = computed(() => {
  const hoy = new Date()
  return citas.value
    .filter(c => new Date(c.fecha) >= hoy && c.estado === 'confirmada')
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
})

const productosStockBajo = computed(() => {
  return productos.value
    .filter(p => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
})

const serviciosPopulares = computed(() => {
  return servicios.value.filter(s => s.activo).slice(0, 5)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

const cargarCitas = async () => {
  try {
    loadingCitas.value = true
    const { data } = await citasAPI.obtenerTodasCitas()
    citas.value = data
    
    // Calcular citas de hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    stats.value.citasHoy = data.filter(c => {
      const fechaCita = new Date(c.fecha)
      fechaCita.setHours(0, 0, 0, 0)
      return fechaCita.getTime() === hoy.getTime()
    }).length
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    loadingCitas.value = false
  }
}

const cargarProductos = async () => {
  try {
    loadingProductos.value = true
    const { data } = await productosAPI.obtenerTodos()
    productos.value = data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loadingProductos.value = false
  }
}

const cargarServicios = async () => {
  try {
    const { data } = await serviciosAPI.obtenerTodos()
    servicios.value = data
  } catch (error) {
    console.error('Error al cargar servicios:', error)
  }
}

const cargarEstadisticas = () => {
  // Simular estadísticas (en producción vendrían del backend)
  stats.value = {
    citasHoy: citas.value.filter(c => {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const fechaCita = new Date(c.fecha)
      fechaCita.setHours(0, 0, 0, 0)
      return fechaCita.getTime() === hoy.getTime()
    }).length,
    ingresosMes: 12500000,
    clientesActivos: 248,
    productosVendidos: 156
  }
}

onMounted(() => {
  cargarCitas()
  cargarProductos()
  cargarServicios()
  cargarEstadisticas()
})
</script>
