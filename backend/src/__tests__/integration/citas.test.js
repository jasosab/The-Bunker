const request = require('supertest');
const app = require('../../app');
const Usuario = require('../../models/Usuario');
const Servicio = require('../../models/Servicio');
const Cita = require('../../models/Cita');

require('../setup');

describe('Citas API Integration Tests', () => {
  let clienteToken, barberoToken, adminToken;
  let cliente, barbero, admin, servicio;

  beforeEach(async () => {
    cliente = await Usuario.create({
      nombre: 'Cliente',
      apellido: 'Test',
      email: 'cliente@test.com',
      password: 'password123',
      telefono: '1234567890',
      rol: 'cliente'
    });

    barbero = await Usuario.create({
      nombre: 'Barbero',
      apellido: 'Test',
      email: 'barbero@test.com',
      password: 'password123',
      telefono: '0987654321',
      rol: 'barbero'
    });

    admin = await Usuario.create({
      nombre: 'Admin',
      apellido: 'Test',
      email: 'admin@test.com',
      password: 'password123',
      telefono: '1122334455',
      rol: 'admin'
    });

    servicio = await Servicio.create({
      nombre: 'Corte de cabello',
      descripcion: 'Corte clásico',
      precio: 15,
      duracion: 30,
      activo: true
    });

    const clienteLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cliente@test.com', password: 'password123' });
    clienteToken = clienteLogin.body.token;

    const barberoLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'barbero@test.com', password: 'password123' });
    barberoToken = barberoLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminLogin.body.token;
  });

  describe('POST /api/citas', () => {
    it('debe crear una cita como cliente autenticado', async () => {
      const response = await request(app)
        .post('/api/citas')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00',
          notas: 'Primera cita'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('mensaje', 'Cita creada exitosamente');
      expect(response.body.cita).toHaveProperty('hora', '10:00');
    });

    it('debe rechazar crear cita sin autenticación', async () => {
      const response = await request(app)
        .post('/api/citas')
        .send({
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00'
        });

      expect(response.status).toBe(401);
    });

    it('debe rechazar cita en horario ocupado', async () => {
      await Cita.create({
        clienteId: cliente._id,
        servicioId: servicio._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'confirmada'
      });

      const response = await request(app)
        .post('/api/citas')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00'
        });

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toBe('Ya existe una cita en ese horario');
    });
  });

  describe('GET /api/citas/mis-citas', () => {
    beforeEach(async () => {
      await Cita.create([
        {
          clienteId: cliente._id,
          servicioId: servicio._id,
          barberoId: barbero._id,
          fecha: '2025-12-15',
          hora: '10:00',
          estado: 'confirmada'
        },
        {
          clienteId: cliente._id,
          servicioId: servicio._id,
          barberoId: barbero._id,
          fecha: '2025-12-16',
          hora: '11:00',
          estado: 'pendiente'
        }
      ]);
    });

    it('debe retornar las citas del cliente autenticado', async () => {
      const response = await request(app)
        .get('/api/citas/mis-citas')
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('hora');
    });

    it('debe rechazar solicitud sin autenticación', async () => {
      const response = await request(app)
        .get('/api/citas/mis-citas');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/citas/disponibilidad', () => {
    beforeEach(async () => {
      await Cita.create({
        clienteId: cliente._id,
        servicioId: servicio._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'confirmada'
      });
    });

    it('debe retornar horarios disponibles', async () => {
      const response = await request(app)
        .get('/api/citas/disponibilidad')
        .query({ fecha: '2025-12-15', servicioId: servicio._id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('horariosDisponibles');
      expect(response.body.horariosDisponibles).not.toContain('10:00');
      expect(response.body.horariosDisponibles).toContain('09:00');
    });
  });

  describe('PUT /api/citas/:id/cancelar', () => {
    let cita;

    beforeEach(async () => {
      cita = await Cita.create({
        clienteId: cliente._id,
        servicioId: servicio._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'confirmada'
      });
    });

    it('debe cancelar una cita como cliente', async () => {
      const response = await request(app)
        .put(`/api/citas/${cita._id}/cancelar`)
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje', 'Cita cancelada');
      expect(response.body.cita.estado).toBe('cancelada');
    });
  });

  describe('GET /api/citas', () => {
    beforeEach(async () => {
      await Cita.create({
        clienteId: cliente._id,
        servicioId: servicio._id,
        barberoId: barbero._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'confirmada'
      });
    });

    it('debe retornar todas las citas como admin', async () => {
      const response = await request(app)
        .get('/api/citas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('debe retornar todas las citas como barbero', async () => {
      const response = await request(app)
        .get('/api/citas')
        .set('Authorization', `Bearer ${barberoToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('debe rechazar solicitud de cliente', async () => {
      const response = await request(app)
        .get('/api/citas')
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(response.status).toBe(403);
    });
  });
});
