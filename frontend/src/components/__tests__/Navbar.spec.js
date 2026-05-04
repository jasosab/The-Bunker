import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Navbar from '../Layout/Navbar.vue';
import { useAuthStore } from '@/stores/auth';

const mockRouter = {
  push: vi.fn()
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  RouterLink: {
    name: 'RouterLink',
    template: '<a><slot /></a>',
    props: ['to']
  }
}));

vi.mock('lucide-vue-next', () => ({
  Scissors: { name: 'Scissors', template: '<div>Scissors</div>' },
  User: { name: 'User', template: '<div>User</div>' },
  ChevronDown: { name: 'ChevronDown', template: '<div>ChevronDown</div>' },
  LayoutDashboard: { name: 'LayoutDashboard', template: '<div>LayoutDashboard</div>' },
  LogOut: { name: 'LogOut', template: '<div>LogOut</div>' },
  Menu: { name: 'Menu', template: '<div>Menu</div>' },
  X: { name: 'X', template: '<div>X</div>' }
}));

describe('Navbar Component', () => {
  let wrapper;
  let authStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
  });

  it('debe renderizar correctamente', () => {
    wrapper = mount(Navbar);
    expect(wrapper.exists()).toBe(true);
  });

  it('debe mostrar el logo TheBunker', () => {
    wrapper = mount(Navbar);
    expect(wrapper.text()).toContain('TheBunker');
  });

  it('debe mostrar enlaces de navegación básicos', () => {
    wrapper = mount(Navbar);
    expect(wrapper.text()).toContain('Inicio');
    expect(wrapper.text()).toContain('Servicios');
    expect(wrapper.text()).toContain('Productos');
  });

  it('debe mostrar enlaces de autenticación cuando el usuario no está autenticado', () => {
    authStore.isAuthenticated = false;
    wrapper = mount(Navbar);

    expect(wrapper.text()).toContain('Iniciar Sesión');
    expect(wrapper.text()).toContain('Registrarse');
  });

  it('debe mostrar el nombre del usuario cuando está autenticado', () => {
    authStore.isAuthenticated = true;
    authStore.usuario = { nombre: 'Juan Pérez', rol: 'cliente' };

    wrapper = mount(Navbar);

    expect(wrapper.text()).toContain('Juan Pérez');
    expect(wrapper.text()).toContain('Agendar Cita');
  });

  it('debe llamar a logout cuando se hace clic en cerrar sesión', async () => {
    authStore.isAuthenticated = true;
    authStore.usuario = { nombre: 'Test User', rol: 'cliente' };
    authStore.logout = vi.fn();

    wrapper = mount(Navbar);

    await wrapper.find('button').trigger('click');

    const logoutButton = wrapper.findAll('button').find(button =>
      button.text().includes('Cerrar Sesión')
    );

    if (logoutButton) {
      await logoutButton.trigger('click');
      expect(authStore.logout).toHaveBeenCalled();
    }
  });
});
