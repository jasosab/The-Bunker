<template>
  <div class="space-y-8">
    <!-- Bienvenida -->
    <div class="card bg-gradient-primary">
      <h2 class="text-3xl font-display font-bold text-white mb-2">
        ¡Hola, {{ authStore.usuario?.nombre }}!
      </h2>
      <p class="text-white/90">
        Aquí están tus citas de hoy
      </p>
    </div>

    <!-- Stats del día -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Citas Hoy</p>
            <p class="text-3xl font-bold text-white">{{ citasHoy.length }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Completadas</p>
            <p class="text-3xl font-bold text-white">{{ citasCompletadas.length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Pendientes</p>
            <p class="text-3xl font-bold text-white">{{ citasPendientes.length }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">Total Semana</p>
            <p class="text-3xl font-bold text-white">{{ citasSemana.length }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card">
      <div class="flex flex-wrap gap-4">
        <button
          v-for="filtro in filtros"
          :key="filtro.value"
          @click="filtroActivo = filtro.value"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all',
            filtroActivo === filtro.value
              ? 'bg-primary-500 text-white shadow-glow'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
          ]"
        >
          {{ filtro.label }}
        </button>
      </div>
    </div>

    <!-- Lista de Citas -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-display font-bold text-white">
          {{ getTituloLista() }}
        </h3>
        <button @click="cargarCitas" class="text-primary-500 hover:text-primary-400">
          <RefreshCw :class="['w-5 h-5', loading && 'animate-spin']" />
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <Loader2 class="w-8 h-8 text-primary-500 animate-spin" />
      </div>

      <div v-else-if="citasFiltradas.length > 0" class="space-y-4">
        <div
          v-for="cita in citasFiltradas"
          :key="cita._id"
          class="bg-dark-700 rounded-lg p-6 hover:bg-dark-600 transition-colors"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <!-- Info de la cita -->
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h4 class="text-white font-semibold text-lg">
                  {{ cita.servicioId?.nombre || 'Servicio' }}
                </h4>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  getEstadoClass(cita.estado)
                ]">
                  {{ cita.estado }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                <div class="flex items-center">
                  <User class="w-4 h-4 mr-2" />
                  <span>{{ cita.clienteId?.nombre }} {{ cita.clienteId?.apellido }}</span>
                </div>
                <div class="flex items-center">
                  <Phone class="w-4 h-4 mr-2" />
                  <span>{{ cita.clienteId?.telefono }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar class="w-4 h-4 mr-2" />
                  <span>{{ formatDate(cita.fecha) }}</span>
                </div>
                <div class="flex items-center">
                  <Clock class="w-4 h-4 mr-2" />
                  <span>{{ cita.hora }} ({{ cita.servicioId?.duracion || 0 }} min)</span>
                </div>
              </div>

              <div v-if="cita.notas" class="mt-2 text-sm text-gray-400 italic">
                Notas: {{ cita.notas }}
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex flex-wrap gap-2">
              <button
                v-if="cita.estado === 'confirmada'"
                @click="completarCita(cita._id)"
                class="btn-primary text-sm py-2 px-4"
              >
                <CheckCircle class="w-4 h-4 mr-1 inline" />
                Completar
              </button>
              
              <button
                v-if="cita.estado === 'confirmada'"
                @click="cancelarCita(cita._id)"
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                <X class="w-4 h-4 mr-1 inline" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <Calendar class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">No hay citas {{ filtroActivo === 'todas' ? '' : filtroActivo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { citasAPI } from '@/services/api'
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  X,
  Loader2,
  RefreshCw,
  TrendingUp
} from 'lucide-vue-next'

const authStore = useAuthStore()

const citas = ref([])
const loading = ref(true)
const filtroActivo = ref('hoy')

const filtros = [
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Esta Semana' },
  { value: 'todas', label: 'Todas' },
]

const hoy = new Date()
hoy.setHours(0, 0, 0, 0)

const citasHoy = computed(() => {
  return citas.value.filter(c => {
    const fechaCita = new Date(c.fecha)
    fechaCita.setHours(0, 0, 0, 0)
    return fechaCita.getTime() === hoy.getTime()
  })
})

const citasSemana = computed(() => {
  const finSemana = new Date(hoy)
  finSemana.setDate(hoy.getDate() + 7)
  
  return citas.value.filter(c => {
    const fechaCita = new Date(c.fecha)
    return fechaCita >= hoy && fechaCita <= finSemana
  })
})

const citasCompletadas = computed(() => {
  return citasHoy.value.filter(c => c.estado === 'completada')
})

const citasPendientes = computed(() => {
  return citasHoy.value.filter(c => c.estado === 'confirmada')
})

const citasFiltradas = computed(() => {
  if (filtroActivo.value === 'hoy') return citasHoy.value
  if (filtroActivo.value === 'semana') return citasSemana.value
  return citas.value
})

const getTituloLista = () => {
  if (filtroActivo.value === 'hoy') return 'Citas de Hoy'
  if (filtroActivo.value === 'semana') return 'Citas de Esta Semana'
  return 'Todas las Citas'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getEstadoClass = (estado) => {
  const classes = {
    confirmada: 'bg-yellow-500/20 text-yellow-500',
    completada: 'bg-green-500/20 text-green-500',
    cancelada: 'bg-red-500/20 text-red-500',
  }
  return classes[estado] || 'bg-gray-500/20 text-gray-500'
}

const cargarCitas = async () => {
  try {
    loading.value = true
    // Por ahora obtendremos todas las citas. En producción, el backend debería filtrar por barbero
    const { data } = await citasAPI.obtenerTodasCitas()
    citas.value = data.sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateA - dateB
    })
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    loading.value = false
  }
}

const completarCita = async (id) => {
  try {
    await citasAPI.actualizar(id, { estado: 'completada' })
    await cargarCitas()
  } catch (error) {
    console.error('Error al completar cita:', error)
  }
}

const cancelarCita = async (id) => {
  if (confirm('¿Estás seguro de cancelar esta cita?')) {
    try {
      await citasAPI.cancelar(id)
      await cargarCitas()
    } catch (error) {
      console.error('Error al cancelar cita:', error)
    }
  }
}

onMounted(() => {
  cargarCitas()
})
</script>
