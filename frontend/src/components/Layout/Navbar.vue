<template>
  <nav class="bg-dark-950 border-b border-dark-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
    <div class="container-custom">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2 group">
          <div class="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Scissors class="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform" />
          </div>
          <span class="text-2xl font-display font-bold text-white">
            Kings<span class="text-primary-500">Cutz</span>
          </span>
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <router-link to="/servicios" class="nav-link">Servicios</router-link>
          <router-link to="/productos" class="nav-link">Productos</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link to="/agendar" class="nav-link">Agendar Cita</router-link>
            <div class="relative" ref="dropdownRef">
              <button 
                @click="toggleDropdown"
                class="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
              >
                <User class="w-5 h-5" />
                <span>{{ authStore.usuario.nombre }}</span>
                <ChevronDown class="w-4 h-4" :class="{ 'rotate-180': isDropdownOpen }" />
              </button>
              
              <div 
                v-show="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-xl border border-dark-700 py-2"
              >
                <router-link 
                  :to="dashboardRoute"
                  class="block px-4 py-2 text-gray-300 hover:bg-dark-700 hover:text-primary-500 transition-colors"
                  @click="isDropdownOpen = false"
                >
                  <div class="flex items-center space-x-2">
                    <LayoutDashboard class="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </router-link>
                <button 
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-700 hover:text-red-500 transition-colors"
                >
                  <div class="flex items-center space-x-2">
                    <LogOut class="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </div>
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
            <router-link to="/registro" class="btn-primary">
              Registrarse
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden text-gray-300 hover:text-primary-500 transition-colors"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-show="isMobileMenuOpen"
        class="md:hidden py-4 border-t border-dark-800"
      >
        <div class="flex flex-col space-y-4">
          <router-link to="/" class="nav-link" @click="isMobileMenuOpen = false">Inicio</router-link>
          <router-link to="/servicios" class="nav-link" @click="isMobileMenuOpen = false">Servicios</router-link>
          <router-link to="/productos" class="nav-link" @click="isMobileMenuOpen = false">Productos</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link to="/agendar" class="nav-link" @click="isMobileMenuOpen = false">Agendar Cita</router-link>
            <router-link 
              :to="dashboardRoute"
              class="nav-link" 
              @click="isMobileMenuOpen = false"
            >
              Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="text-left nav-link text-red-500"
            >
              Cerrar Sesión
            </button>
          </template>
          
          <template v-else>
            <router-link to="/login" class="nav-link" @click="isMobileMenuOpen = false">Iniciar Sesión</router-link>
            <router-link to="/registro" class="btn-primary inline-block text-center" @click="isMobileMenuOpen = false">
              Registrarse
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Scissors, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard 
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const dashboardRoute = computed(() => {
  const rol = authStore.usuario?.rol
  if (rol === 'admin' || rol === 'recepcionista') return '/dashboard/admin'
  if (rol === 'barbero') return '/dashboard/barbero'
  return '/dashboard/cliente'
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleLogout = () => {
  authStore.logout()
  isMobileMenuOpen.value = false
  isDropdownOpen.value = false
  router.push('/')
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
