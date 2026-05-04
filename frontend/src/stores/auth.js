import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    esCliente: (state) => state.usuario?.rol === 'cliente',
    esBarbero: (state) => state.usuario?.rol === 'barbero',
    esRecepcionista: (state) => state.usuario?.rol === 'recepcionista',
    esAdmin: (state) => state.usuario?.rol === 'admin',
    nombreCompleto: (state) => 
      state.usuario ? `${state.usuario.nombre} ${state.usuario.apellido}` : '',
  },

  actions: {
    async login(credentials) {
      try {
        const { data } = await authAPI.login(credentials)
        this.token = data.token
        this.usuario = data.usuario
        this.isAuthenticated = true
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        
        return data
      } catch (error) {
        throw error
      }
    },

    async registro(userData) {
      try {
        const { data } = await authAPI.registro(userData)
        this.token = data.token
        this.usuario = data.usuario
        this.isAuthenticated = true
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        
        return data
      } catch (error) {
        throw error
      }
    },

    async obtenerPerfil() {
      try {
        const { data } = await authAPI.perfil()
        this.usuario = data
        localStorage.setItem('usuario', JSON.stringify(data))
        return data
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.usuario = null
      this.token = null
      this.isAuthenticated = false
      
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    },
  },
})
