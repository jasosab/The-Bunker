import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/registro',
    name: 'Registro',
    component: () => import('@/views/Auth/Registro.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: () => import('@/views/Servicios.vue'),
  },
  {
    path: '/productos',
    name: 'Productos',
    component: () => import('@/views/Productos.vue'),
  },
  {
    path: '/agendar',
    name: 'Agendar',
    component: () => import('@/views/Agendar.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/Index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'cliente',
        name: 'DashboardCliente',
        component: () => import('@/views/Dashboard/Cliente.vue'),
        meta: { roles: ['cliente'] },
      },
      {
        path: 'barbero',
        name: 'DashboardBarbero',
        component: () => import('@/views/Dashboard/Barbero.vue'),
        meta: { roles: ['barbero'] },
      },
      {
        path: 'admin',
        name: 'DashboardAdmin',
        component: () => import('@/views/Dashboard/Admin.vue'),
        meta: { roles: ['admin', 'recepcionista'] },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Guards de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
  const roles = to.meta.roles

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Si la ruta es solo para invitados y el usuario está autenticado
  if (requiresGuest && authStore.isAuthenticated) {
    // Redirigir según el rol del usuario
    const rol = authStore.usuario?.rol
    if (rol === 'admin' || rol === 'recepcionista') {
      return next('/dashboard/admin')
    } else if (rol === 'barbero') {
      return next('/dashboard/barbero')
    } else {
      return next('/dashboard/cliente')
    }
  }

  // Si la ruta requiere roles específicos
  if (roles && roles.length > 0 && !roles.includes(authStore.usuario?.rol)) {
    return next('/')
  }

  next()
})

export default router
