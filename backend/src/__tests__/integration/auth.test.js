const request = require('supertest');
const app = require('../../app');
const Usuario = require('../../models/Usuario');

require('../setup');

describe('Auth API Integration Tests', () => {
  describe('POST /api/auth/registro', () => {
    it('debe registrar un nuevo usuario', async () => {
      const response = await request(app)
        .post('/api/auth/registro')
        .send({
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          password: 'password123',
          telefono: '1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.usuario).toHaveProperty('email', 'juan@example.com');
      expect(response.body.usuario).toHaveProperty('rol', 'cliente');
    });

    it('debe rechazar registro con email duplicado', async () => {
      await Usuario.create({
        nombre: 'Existente Usuario',
        email: 'existente@example.com',
        password: 'password123',
        telefono: '1234567890'
      });

      const response = await request(app)
        .post('/api/auth/registro')
        .send({
          nombre: 'Nuevo Usuario',
          email: 'existente@example.com',
          password: 'password123',
          telefono: '0987654321'
        });

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toBe('El email ya está registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await Usuario.create({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        telefono: '1234567890',
        activo: true
      });
    });

    it('debe iniciar sesión con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('mensaje', 'Login exitoso');
      expect(response.body.usuario.email).toBe('test@example.com');
    });

    it('debe rechazar login con email incorrecto', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.mensaje).toBe('Credenciales inválidas');
    });

    it('debe rechazar login con password incorrecto', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'passwordIncorrecto'
        });

      expect(response.status).toBe(401);
      expect(response.body.mensaje).toBe('Credenciales inválidas');
    });

    it('debe rechazar login de usuario desactivado', async () => {
      await Usuario.findOneAndUpdate(
        { email: 'test@example.com' },
        { activo: false }
      );

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.mensaje).toBe('Usuario desactivado');
    });
  });

  describe('GET /api/auth/perfil', () => {
    let token;
    let usuarioId;

    beforeEach(async () => {
      const usuario = await Usuario.create({
        nombre: 'Perfil Test',
        email: 'perfil@example.com',
        password: 'password123',
        telefono: '1234567890'
      });

      usuarioId = usuario._id;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'perfil@example.com',
          password: 'password123'
        });

      token = loginResponse.body.token;
    });

    it('debe retornar el perfil del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/auth/perfil')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre', 'Perfil Test');
      expect(response.body).toHaveProperty('email', 'perfil@example.com');
    });

    it('debe rechazar solicitud sin token', async () => {
      const response = await request(app)
        .get('/api/auth/perfil');

      expect(response.status).toBe(401);
      expect(response.body.mensaje).toBe('No autorizado, no hay token');
    });

    it('debe rechazar solicitud con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/perfil')
        .set('Authorization', 'Bearer token-invalido');

      expect(response.status).toBe(401);
      expect(response.body.mensaje).toBe('Token no válido');
    });
  });
});
