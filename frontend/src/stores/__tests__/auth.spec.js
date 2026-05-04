import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';
import { authAPI } from '@/services/api';

vi.mock('@/services/api', () => ({
  authAPI: {
    login: vi.fn(),
    registro: vi.fn(),
    perfil: vi.fn()
  }
}));

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('debe inicializar con valores por defecto cuando no hay datos en localStorage', () => {
      const store = useAuthStore();

      expect(store.usuario).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it('debe cargar datos del localStorage si existen', () => {
      const mockUsuario = { id: '1', nombre: 'Test User', rol: 'cliente' };
      const mockToken = 'test-token';

      localStorage.setItem('usuario', JSON.stringify(mockUsuario));
      localStorage.setItem('token', mockToken);

      const store = useAuthStore();

      expect(store.usuario).toEqual(mockUsuario);
      expect(store.token).toBe(mockToken);
      expect(store.isAuthenticated).toBe(true);
    });
  });

  describe('Getters', () => {
    it('esCliente debe retornar true para usuario con rol cliente', () => {
      const store = useAuthStore();
      store.usuario = { rol: 'cliente' };

      expect(store.esCliente).toBe(true);
      expect(store.esBarbero).toBe(false);
      expect(store.esAdmin).toBe(false);
    });

    it('esBarbero debe retornar true para usuario con rol barbero', () => {
      const store = useAuthStore();
      store.usuario = { rol: 'barbero' };

      expect(store.esBarbero).toBe(true);
      expect(store.esCliente).toBe(false);
    });

    it('esAdmin debe retornar true para usuario con rol admin', () => {
      const store = useAuthStore();
      store.usuario = { rol: 'admin' };

      expect(store.esAdmin).toBe(true);
      expect(store.esCliente).toBe(false);
    });

    it('esRecepcionista debe retornar true para usuario con rol recepcionista', () => {
      const store = useAuthStore();
      store.usuario = { rol: 'recepcionista' };

      expect(store.esRecepcionista).toBe(true);
      expect(store.esCliente).toBe(false);
    });

    it('nombreCompleto debe formatear correctamente el nombre', () => {
      const store = useAuthStore();
      store.usuario = { nombre: 'Juan', apellido: 'Pérez' };

      expect(store.nombreCompleto).toBe('Juan Pérez');
    });

    it('nombreCompleto debe retornar string vacío si no hay usuario', () => {
      const store = useAuthStore();
      store.usuario = null;

      expect(store.nombreCompleto).toBe('');
    });
  });

  describe('Action: login', () => {
    it('debe iniciar sesión exitosamente', async () => {
      const store = useAuthStore();
      const mockResponse = {
        data: {
          token: 'test-token',
          usuario: {
            id: '1',
            nombre: 'Test',
            email: 'test@example.com',
            rol: 'cliente'
          }
        }
      };

      authAPI.login.mockResolvedValue(mockResponse);

      const result = await store.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(store.token).toBe('test-token');
      expect(store.usuario).toEqual(mockResponse.data.usuario);
      expect(store.isAuthenticated).toBe(true);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(JSON.parse(localStorage.getItem('usuario'))).toEqual(mockResponse.data.usuario);
    });

    it('debe lanzar error si el login falla', async () => {
      const store = useAuthStore();
      const mockError = new Error('Credenciales inválidas');

      authAPI.login.mockRejectedValue(mockError);

      await expect(store.login({
        email: 'test@example.com',
        password: 'wrong-password'
      })).rejects.toThrow('Credenciales inválidas');

      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('Action: registro', () => {
    it('debe registrar un usuario exitosamente', async () => {
      const store = useAuthStore();
      const mockResponse = {
        data: {
          token: 'new-token',
          usuario: {
            id: '2',
            nombre: 'Nuevo Usuario',
            email: 'nuevo@example.com',
            rol: 'cliente'
          }
        }
      };

      authAPI.registro.mockResolvedValue(mockResponse);

      const result = await store.registro({
        nombre: 'Nuevo Usuario',
        email: 'nuevo@example.com',
        password: 'password123'
      });

      expect(store.token).toBe('new-token');
      expect(store.usuario).toEqual(mockResponse.data.usuario);
      expect(store.isAuthenticated).toBe(true);
      expect(localStorage.getItem('token')).toBe('new-token');
    });

    it('debe lanzar error si el registro falla', async () => {
      const store = useAuthStore();
      const mockError = new Error('Email ya registrado');

      authAPI.registro.mockRejectedValue(mockError);

      await expect(store.registro({
        nombre: 'Test',
        email: 'existente@example.com',
        password: 'password123'
      })).rejects.toThrow('Email ya registrado');

      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('Action: obtenerPerfil', () => {
    it('debe obtener y actualizar el perfil del usuario', async () => {
      const store = useAuthStore();
      const mockPerfil = {
        id: '1',
        nombre: 'Usuario Actualizado',
        email: 'test@example.com',
        rol: 'cliente'
      };

      authAPI.perfil.mockResolvedValue({ data: mockPerfil });

      const result = await store.obtenerPerfil();

      expect(store.usuario).toEqual(mockPerfil);
      expect(JSON.parse(localStorage.getItem('usuario'))).toEqual(mockPerfil);
    });

    it('debe lanzar error si falla la obtención del perfil', async () => {
      const store = useAuthStore();
      const mockError = new Error('No autorizado');

      authAPI.perfil.mockRejectedValue(mockError);

      await expect(store.obtenerPerfil()).rejects.toThrow('No autorizado');
    });
  });

  describe('Action: logout', () => {
    it('debe cerrar sesión y limpiar el estado', () => {
      const store = useAuthStore();

      store.usuario = { id: '1', nombre: 'Test' };
      store.token = 'test-token';
      store.isAuthenticated = true;
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('usuario', JSON.stringify({ id: '1' }));

      store.logout();

      expect(store.usuario).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('usuario')).toBeNull();
    });
  });
});
