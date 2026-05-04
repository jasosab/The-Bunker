const Pedido = require('../../models/Pedido');
const Producto = require('../../models/Producto');
const Usuario = require('../../models/Usuario');
const {
  obtenerMisPedidos,
  obtenerTodosPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido
} = require('../../controllers/pedidosController');

require('../setup');

describe('PedidosController', () => {
  let usuario, producto1, producto2;

  beforeEach(async () => {
    usuario = await Usuario.create({
      nombre: 'Cliente',
      apellido: 'Test',
      email: 'cliente@test.com',
      password: 'password123',
      telefono: '1234567890',
      rol: 'cliente'
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
  });

  describe('crearPedido', () => {
    it('debe crear un pedido exitosamente', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [
            { productoId: producto1._id, cantidad: 2 },
            { productoId: producto2._id, cantidad: 1 }
          ],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Pedido creado exitosamente',
          pedido: expect.objectContaining({
            total: 65,
            estado: 'pendiente'
          })
        })
      );

      const productoActualizado1 = await Producto.findById(producto1._id);
      expect(productoActualizado1.stock).toBe(48);

      const productoActualizado2 = await Producto.findById(producto2._id);
      expect(productoActualizado2.stock).toBe(29);
    });

    it('debe rechazar pedido sin productos', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Debe incluir al menos un producto'
      });
    });

    it('debe rechazar pedido con cantidad inválida', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [
            { productoId: producto1._id, cantidad: 0 }
          ],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'La cantidad debe ser mayor a 0'
      });
    });

    it('debe rechazar pedido con producto inexistente', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [
            { productoId: '507f1f77bcf86cd799439011', cantidad: 1 }
          ],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: expect.stringContaining('no encontrado')
        })
      );
    });

    it('debe rechazar pedido con stock insuficiente', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [
            { productoId: producto1._id, cantidad: 100 }
          ],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: expect.stringContaining('Stock insuficiente')
        })
      );

      const productoNoModificado = await Producto.findById(producto1._id);
      expect(productoNoModificado.stock).toBe(50);
    });

    it('debe rechazar pedido con producto inactivo', async () => {
      await Producto.findByIdAndUpdate(producto1._id, { activo: false });

      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [
            { productoId: producto1._id, cantidad: 1 }
          ],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: expect.stringContaining('no está disponible')
        })
      );
    });

    it('debe rechazar pedido con ID de producto inválido', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [
            { productoId: 'id-invalido', cantidad: 1 }
          ],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'ID de producto inválido'
      });
    });

    it('debe calcular el total correctamente con múltiples productos', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          productos: [
            { productoId: producto1._id, cantidad: 3 },
            { productoId: producto2._id, cantidad: 2 }
          ],
          direccionEnvio: 'Calle Principal 123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearPedido(req, res);

      const expectedTotal = (25 * 3) + (15 * 2);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          pedido: expect.objectContaining({
            total: expectedTotal
          })
        })
      );
    });
  });

  describe('obtenerMisPedidos', () => {
    it('debe retornar los pedidos del usuario autenticado', async () => {
      await Pedido.create([
        {
          clienteId: usuario._id,
          productos: [{ productoId: producto1._id, cantidad: 1, precioUnitario: 25 }],
          total: 25,
          direccionEnvio: 'Dirección 1',
          estado: 'pendiente'
        },
        {
          clienteId: usuario._id,
          productos: [{ productoId: producto2._id, cantidad: 2, precioUnitario: 15 }],
          total: 30,
          direccionEnvio: 'Dirección 2',
          estado: 'procesando'
        }
      ]);

      const req = {
        usuario: { id: usuario._id }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerMisPedidos(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            total: 25
          }),
          expect.objectContaining({
            total: 30
          })
        ])
      );
    });
  });

  describe('obtenerPedido', () => {
    it('debe retornar un pedido por ID', async () => {
      const pedido = await Pedido.create({
        clienteId: usuario._id,
        productos: [{ productoId: producto1._id, cantidad: 1, precioUnitario: 25 }],
        total: 25,
        direccionEnvio: 'Dirección Test',
        estado: 'pendiente'
      });

      const req = {
        params: { id: pedido._id }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerPedido(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 25,
          direccionEnvio: 'Dirección Test'
        })
      );
    });

    it('debe retornar 404 para pedido inexistente', async () => {
      const req = {
        params: { id: '507f1f77bcf86cd799439011' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerPedido(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Pedido no encontrado'
      });
    });
  });

  describe('actualizarPedido', () => {
    it('debe actualizar el estado de un pedido', async () => {
      const pedido = await Pedido.create({
        clienteId: usuario._id,
        productos: [{ productoId: producto1._id, cantidad: 1, precioUnitario: 25 }],
        total: 25,
        direccionEnvio: 'Dirección Test',
        estado: 'pendiente'
      });

      const req = {
        params: { id: pedido._id },
        body: { estado: 'procesando' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await actualizarPedido(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Pedido actualizado',
          pedido: expect.objectContaining({
            estado: 'procesando'
          })
        })
      );
    });
  });
});
