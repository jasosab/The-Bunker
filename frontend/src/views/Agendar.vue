<template>
  <div class="min-h-screen py-20">
    <div class="container-custom max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-4">
          Agenda tu Cita
        </h1>
        <p class="text-gray-400 text-lg">
          Selecciona el servicio, fecha y hora que prefieras
        </p>
      </div>

      <div class="card">
        <form @submit.prevent="agendarCita" class="space-y-8">
          <!-- Error/Success messages -->
          <div 
            v-if="error" 
            class="bg-red-500/10 border border-red-500 rounded-lg p-4"
          >
            <div class="flex items-center space-x-2">
              <AlertCircle class="w-5 h-5 text-red-500" />
              <p class="text-red-500">{{ error }}</p>
            </div>
          </div>

          <div 
            v-if="success" 
            class="bg-green-500/10 border border-green-500 rounded-lg p-4"
          >
            <div class="flex items-center space-x-2">
              <CheckCircle class="w-5 h-5 text-green-500" />
              <p class="text-green-500">{{ success }}</p>
            </div>
          </div>

          <!-- Paso 1: Seleccionar Servicio -->
          <div>
            <label class="block text-lg font-display font-semibold text-white mb-4">
              1. Selecciona tu Servicio
            </label>
            
            <div v-if="loadingServicios" class="flex justify-center py-8">
              <Loader2 class="w-8 h-8 text-primary-500 animate-spin" />
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="servicio in servicios"
                :key="servicio._id"
                type="button"
                @click="formData.servicioId = servicio._id"
                :class="[
                  'p-4 rounded-lg border-2 transition-all text-left',
                  formData.servicioId === servicio._id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-700 bg-dark-700/50 hover:border-primary-500/50'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-white font-semibold mb-1">{{ servicio.nombre }}</h3>
                    <p class="text-gray-400 text-sm mb-2">{{ servicio.descripcion }}</p>
                    <div class="flex items-center space-x-4 text-sm">
                      <span class="text-primary-500 font-bold">
                        ${{ servicio.precio.toLocaleString() }}
                      </span>
                      <span class="text-gray-500 flex items-center">
                        <Clock class="w-4 h-4 mr-1" />
                        {{ servicio.duracion }} min
                      </span>
                    </div>
                  </div>
                  <CheckCircle 
                    v-if="formData.servicioId === servicio._id"
                    class="w-6 h-6 text-primary-500 flex-shrink-0"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- Paso 2: Seleccionar Fecha -->
          <div>
            <label class="block text-lg font-display font-semibold text-white mb-4">
              2. Selecciona la Fecha
            </label>
            <input
              v-model="formData.fecha"
              type="date"
              :min="minDate"
              required
              class="input-field"
            />
          </div>

          <!-- Paso 3: Seleccionar Hora -->
          <div>
            <label class="block text-lg font-display font-semibold text-white mb-4">
              3. Selecciona la Hora
            </label>
            
            <div v-if="loadingHorarios" class="flex justify-center py-8">
              <Loader2 class="w-8 h-8 text-primary-500 animate-spin" />
            </div>

            <div v-else-if="horariosDisponibles.length > 0" class="grid grid-cols-3 md:grid-cols-4 gap-3">
              <button
                v-for="hora in horariosDisponibles"
                :key="hora"
                type="button"
                @click="formData.hora = hora"
                :class="[
                  'py-3 px-4 rounded-lg font-semibold transition-all',
                  formData.hora === hora
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                ]"
              >
                {{ hora }}
              </button>
            </div>

            <p v-else-if="formData.fecha" class="text-gray-400 text-center py-8">
              No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha.
            </p>

            <p v-else class="text-gray-400 text-center py-8">
              Selecciona una fecha para ver los horarios disponibles
            </p>
          </div>

          <!-- Notas adicionales -->
          <div>
            <label class="block text-lg font-display font-semibold text-white mb-4">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              v-model="formData.notas"
              rows="4"
              class="input-field"
              placeholder="¿Alguna preferencia o solicitud especial?"
            ></textarea>
          </div>

          <!-- Botón de envío -->
          <button
            type="submit"
            :disabled="loading || !formData.servicioId || !formData.fecha || !formData.hora"
            class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex items-center justify-center space-x-2">
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <Calendar v-else class="w-5 h-5" />
              <span>{{ loading ? 'Agendando...' : 'Confirmar Cita' }}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { serviciosAPI, citasAPI } from '@/services/api'
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from 'lucide-vue-next'

const router = useRouter()

const servicios = ref([])
const horariosDisponibles = ref([])
const loadingServicios = ref(true)
const loadingHorarios = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const formData = ref({
  servicioId: '',
  fecha: '',
  hora: '',
  notas: ''
})

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const cargarServicios = async () => {
  try {
    loadingServicios.value = true
    const { data } = await serviciosAPI.obtenerTodos()
    servicios.value = data.filter(s => s.activo)
  } catch (err) {
    error.value = 'Error al cargar servicios'
  } finally {
    loadingServicios.value = false
  }
}

const cargarHorarios = async () => {
  if (!formData.value.fecha || !formData.value.servicioId) return
  
  try {
    loadingHorarios.value = true
    horariosDisponibles.value = []
    formData.value.hora = ''
    
    const { data } = await citasAPI.obtenerDisponibilidad({
      fecha: formData.value.fecha,
      servicioId: formData.value.servicioId
    })
    
    horariosDisponibles.value = data.horariosDisponibles || []
  } catch (err) {
    console.error('Error al cargar horarios:', err)
    horariosDisponibles.value = []
  } finally {
    loadingHorarios.value = false
  }
}

const agendarCita = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    const citaData = {
      servicioId: formData.value.servicioId,
      fecha: formData.value.fecha,
      hora: formData.value.hora,
      notas: formData.value.notas
    }
    
    await citasAPI.crear(citaData)
    
    success.value = '¡Cita agendada exitosamente!'
    
    setTimeout(() => {
      router.push('/dashboard/cliente')
    }, 2000)
  } catch (err) {
    error.value = err.response?.data?.mensaje || 'Error al agendar la cita'
  } finally {
    loading.value = false
  }
}

watch(() => [formData.value.fecha, formData.value.servicioId], () => {
  cargarHorarios()
})

onMounted(() => {
  cargarServicios()
})
</script>
