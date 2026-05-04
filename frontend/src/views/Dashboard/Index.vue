<template>
  <div class="min-h-screen flex bg-dark-900">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-dark-950 border-r border-dark-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="h-20 flex items-center px-6 border-b border-dark-800">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Scissors class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-display font-bold text-white">
            Kings<span class="text-primary-500">Cutz</span>
          </span>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-800 hover:text-primary-500 transition-colors"
          active-class="bg-primary-500/10 text-primary-500"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="font-medium">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- User info -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold truncate">{{ authStore.nombreCompleto }}</p>
            <p class="text-gray-400 text-sm capitalize">{{ authStore.usuario?.rol }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-dark-800 hover:bg-red-500/10 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
        >
          <LogOut class="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64">
      <!-- Top Bar -->
      <header class="h-20 bg-dark-950 border-b border-dark-800 flex items-center px-6 sticky top-0 z-40">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="lg:hidden text-gray-300 hover:text-primary-500 mr-4"
        >
          <Menu class="w-6 h-6" />
        </button>
        <h1 class="text-2xl font-display font-bold text-white">
          {{ pageTitle }}
        </h1>
      </header>

      <!-- Content -->
      <main class="p-6">
        <router-view />
      </main>
    </div>

    <!-- Overlay para mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Package,
  Users,
  Settings,
  User,
  LogOut,
  Menu,
  Clipboard
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

const menuItems = computed(() => {
  const rol = authStore.usuario?.rol

  if (rol === 'admin' || rol === 'recepcionista') {
    return [
      { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/dashboard/admin/citas', icon: Calendar, label: 'Citas' },
      { path: '/dashboard/admin/servicios', icon: Scissors, label: 'Servicios' },
      { path: '/dashboard/admin/productos', icon: Package, label: 'Productos' },
      { path: '/dashboard/admin/usuarios', icon: Users, label: 'Usuarios' },
    ]
  }

  if (rol === 'barbero') {
    return [
      { path: '/dashboard/barbero', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/dashboard/barbero/citas', icon: Calendar, label: 'Mis Citas' },
    ]
  }

  return [
    { path: '/dashboard/cliente', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/cliente/citas', icon: Calendar, label: 'Mis Citas' },
    { path: '/dashboard/cliente/pedidos', icon: ShoppingBag, label: 'Mis Pedidos' },
  ]
})

const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('citas')) return 'Citas'
  if (path.includes('servicios')) return 'Servicios'
  if (path.includes('productos')) return 'Productos'
  if (path.includes('usuarios')) return 'Usuarios'
  if (path.includes('pedidos')) return 'Pedidos'
  return 'Dashboard'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
