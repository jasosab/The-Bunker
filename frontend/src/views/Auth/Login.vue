<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-lg">
            <Scissors class="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 class="text-4xl font-display font-bold text-white mb-2">
          Bienvenido de vuelta
        </h2>
        <p class="text-gray-400">
          Inicia sesión en tu cuenta de TheBunker
        </p>
      </div>

      <!-- Formulario -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error message -->
          <div 
            v-if="error" 
            class="bg-red-500/10 border border-red-500 rounded-lg p-4"
          >
            <div class="flex items-center space-x-2">
              <AlertCircle class="w-5 h-5 text-red-500" />
              <p class="text-red-500 text-sm">{{ error }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="input-field pl-10"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-500 hover:text-primary-500" />
                <EyeOff v-else class="h-5 w-5 text-gray-500 hover:text-primary-500" />
              </button>
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary flex items-center justify-center"
          >
            <Loader2 v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
            <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-dark-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-dark-800 text-gray-400">¿No tienes cuenta?</span>
          </div>
        </div>

        <!-- Registro link -->
        <router-link to="/registro" class="block text-center btn-secondary">
          Crear Cuenta
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Scissors, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2 
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.login(formData.value)
    
    // Redirigir según el rol
    const rol = authStore.usuario.rol
    if (rol === 'admin' || rol === 'recepcionista') {
      router.push('/dashboard/admin')
    } else if (rol === 'barbero') {
      router.push('/dashboard/barbero')
    } else {
      router.push('/dashboard/cliente')
    }
  } catch (err) {
    error.value = err.response?.data?.mensaje || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
