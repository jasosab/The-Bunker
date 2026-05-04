const request = require('supertest');
const app = require('../../app');
const Usuario = require('../../models/Usuario');
const Producto = require('../../models/Producto');
const Pedido = require('../../models/Pedido');

require('../setup');

describe('Pedidos API Integration Tests', () => {
  let clienteToken, adminToken;
  let cliente, admin, producto1, producto2;

  beforeEach(async () => {
    cliente = await Usuario.create({
      nombre: 'Cliente Test',
      email: 'cliente@test.com',
      password: 'password123',
      telefono: '1234567890',
      rol: 'cliente'
    });

    admin = await Usuario.create({
      nombre: 'Admin Test',
      email: 'admin@test.com',
      password: 'password123',
      telefono: '1122334455',
      rol: 'admin'
    });

    producto1 = await Producto.create({
      nombre: 'Shampoo Premium',
      descripcion: 'Shampoo de calidad',
      precio: 25,
      stock: 50,
      categoria: 'Cuidado del Cabello',
      activo: true
    });

    producto2 = await Producto.create({
      nombre: 'Cera para cabello',
      descripcion: 'Fijación fuerte',
      precio: 15,
      stock: 30,
      categoria: 'Styling',
      activo: true
    });

    const clienteLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cliente@test.com', password: 'password123' });
    clienteToken = clienteLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminLogin.body.token;
  });

  describe('POST /api/pedidos', () => {
    it('debe crear un pedido exitosamente', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          productos: [
            { productoId: producto1._id, cantidad: 2 },
            { productoId: producto2._id, cantidad: 1 }
          ],
          direccionEnvio: 'Calle Principal 123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('mensaje', 'Pedido creado exitosamente');
      expect(response.body.pedido).toHaveProperty('total', 65);
      expect(response.body.pedido.numeroPedido).toMatch(/^PED-\d{9}$/);

      const productoActualizado = await Producto.findById(producto1._id);
      expect(productoActualizado.stock).toBe(48);
    });

    it('debe rechazar pedido sin autenticación', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .send({
          productos: [{ productoId: producto1._id, cantidad: 1 }],
          direccionEnvio: 'Calle Principal 123'
        });

      expect(response.status).toBe(401);
    });

    it('debe rechazar pedido sin productos', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          productos: [],
          direccionEnvio: 'Calle Principal 123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errores');
      expect(response.body.errores[0].msg).toBe('Los productos son obligatorios');
    });

    it('debe rechazar pedido con stock insuficiente', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          productos: [{ productoId: producto1._id, cantidad: 100 }],
          direccionEnvio: 'Calle Principal 123'
        });

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toContain('Stock insuficiente');

      const productoNoModificado = await Producto.findById(producto1._id);
      expect(productoNoModificado.stock).toBe(50);
    });

    it('debe rechazar pedido con producto inactivo', async () => {
      await Producto.findByIdAndUpdate(producto1._id, { activo: false });

      const response = await request(app)
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          productos: [{ productoId: producto1._id, cantidad: 1 }],
          direccionEnvio: 'Calle Principal 123'
        });

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toContain('no está disponible');
    });

    it('debe rechazar pedido con cantidad inválida', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          productos: [{ productoId: producto1._id, cantidad: 0 }],
          direccionEnvio: 'Calle Principal 123'
        });

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toBe('La cantidad debe ser mayor a 0');
    });

    it('debe calcular correctamente el total con múltiples productos', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({
          productos: [
            { productoId: producto1._id, cantidad: 3 },
            { productoId: producto2._id, cantidad: 2 }
          ],
          direccionEnvio: 'Calle Principal 123'
        });

      const expectedTotal = (25 * 3) + (15 * 2);

      expect(response.status).toBe(201);
      expect(response.body.pedido.total).toBe(expectedTotal);
    });
  });

  describe('GET /api/pedidos/mis-pedidos', () => {
    beforeEach(async () => {
      await Pedido.create([
        {
          clienteId: cliente._id,
          productos: [{ productoId: producto1._id, cantidad: 1, precioUnitario: 25 }],
          total: 25,
          direccionEnvio: 'Dirección 1',
          estado: 'pendiente'
        },
        {
          clienteId: cliente._id,
          productos: [{ productoId: producto2._id, cantidad: 2, precioUnitario: 15 }],
          total: 30,
          direccionEnvio: 'Dirección 2',
          estado: 'procesando'
        }
      ]);
    });

    it('debe retornar los pedidos del cliente autenticado', async () => {
      const response = await request(app)
        .get('/api/pedidos/mis-pedidos')
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('numeroPedido');
    });

    it('debe rechazar solicitud sin autenticación', async () => {
      const response = await request(app)
        .get('/api/pedidos/mis-pedidos');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/pedidos', () => {
    beforeEach(async () => {
      await Pedido.create({
        clienteId: cliente._id,
        productos: [{ productoId: producto1._id, cantidad: 1, precioUnitario: 25 }],
        total: 25,
        direccionEnvio: 'Dirección Test',
        estado: 'pendiente'
      });
    });

    it('debe retornar todos los pedidos como admin', async () => {
      const response = await request(app)
        .get('/api/pedidos')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('debe rechazar solicitud de cliente', async () => {
      const response = await request(app)
        .get('/api/pedidos')
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/pedidos/:id', () => {
    let pedido;

    beforeEach(async () => {
      pedido = await Pedido.create({
        clienteId: cliente._id,
        productos: [{ productoId: producto1._id, cantidad: 1, precioUnitario: 25 }],
        total: 25,
        direccionEnvio: 'Dirección Test',
        estado: 'pendiente'
      });
    });

    it('debe retornar un pedido por ID como cliente propietario', async () => {
      const response = await request(app)
        .get(`/api/pedidos/${pedido._id}`)
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total', 25);
      expect(response.body).toHaveProperty('direccionEnvio', 'Dirección Test');
    });

    it('debe retornar un pedido por ID como admin', async () => {
      const response = await request(app)
        .get(`/api/pedidos/${pedido._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total', 25);
    });
  });

  describe('PUT /api/pedidos/:id', () => {
    let pedido;

    beforeEach(async () => {
      pedido = await Pedido.create({
        clienteId: cliente._id,
        productos: [{ productoId: producto1._id, cantidad: 1, precioUnitario: 25 }],
        total: 25,
        direccionEnvio: 'Dirección Test',
        estado: 'pendiente'
      });
    });

    it('debe actualizar el estado de un pedido como admin', async () => {
      const response = await request(app)
        .put(`/api/pedidos/${pedido._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'procesando' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje', 'Pedido actualizado');
      expect(response.body.pedido.estado).toBe('procesando');
    });

    it('debe rechazar actualización de cliente', async () => {
      const response = await request(app)
        .put(`/api/pedidos/${pedido._id}`)
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ estado: 'procesando' });

      expect(response.status).toBe(403);
    });
  });
});
