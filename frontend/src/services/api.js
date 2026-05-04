import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registro: (userData) => api.post('/auth/registro', userData),
  perfil: () => api.get('/auth/perfil'),
}

// Servicios
export const serviciosAPI = {
  obtenerTodos: () => api.get('/servicios'),
  obtenerPorId: (id) => api.get(`/servicios/${id}`),
  crear: (servicio) => api.post('/servicios', servicio),
  actualizar: (id, servicio) => api.put(`/servicios/${id}`, servicio),
  eliminar: (id) => api.delete(`/servicios/${id}`),
}

// Citas
export const citasAPI = {
  obtenerMisCitas: () => api.get('/citas/mis-citas'),
  obtenerPorId: (id) => api.get(`/citas/${id}`),
  crear: (cita) => api.post('/citas', cita),
  actualizar: (id, cita) => api.put(`/citas/${id}`, cita),
  cancelar: (id) => api.put(`/citas/${id}/cancelar`),
  obtenerDisponibilidad: (params) => api.get('/citas/disponibilidad', { params }),
  obtenerTodasCitas: () => api.get('/citas'),
}

// Productos
export const productosAPI = {
  obtenerTodos: (params) => api.get('/productos', { params }),
  obtenerPorId: (id) => api.get(`/productos/${id}`),
  crear: (producto) => api.post('/productos', producto),
  actualizar: (id, producto) => api.put(`/productos/${id}`, producto),
  eliminar: (id) => api.delete(`/productos/${id}`),
}

// Pedidos
export const pedidosAPI = {
  obtenerMisPedidos: () => api.get('/pedidos/mis-pedidos'),
  obtenerPorId: (id) => api.get(`/pedidos/${id}`),
  crear: (pedido) => api.post('/pedidos', pedido),
  actualizar: (id, pedido) => api.put(`/pedidos/${id}`, pedido),
  obtenerTodosPedidos: () => api.get('/pedidos'),
}

// Usuarios (solo admin)
export const usuariosAPI = {
  obtenerTodos: () => api.get('/usuarios'),
  obtenerPorId: (id) => api.get(`/usuarios/${id}`),
  actualizar: (id, usuario) => api.put(`/usuarios/${id}`, usuario),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
  cambiarEstado: (id, estado) => api.put(`/usuarios/${id}/estado`, { estado }),
}

export default api
