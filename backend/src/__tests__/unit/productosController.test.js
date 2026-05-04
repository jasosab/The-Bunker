const Producto = require('../../models/Producto');
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../../controllers/productosController');

require('../setup');

describe('ProductosController', () => {
  describe('crearProducto', () => {
    it('debe crear un producto exitosamente', async () => {
      const req = {
        body: {
          nombre: 'Shampoo Premium',
          descripcion: 'Shampoo de alta calidad',
          precio: 25,
          stock: 100,
          categoria: 'Cuidado del Cabello',
          activo: true
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Producto creado',
          producto: expect.objectContaining({
            nombre: 'Shampoo Premium',
            precio: 25,
            stock: 100
          })
        })
      );
    });
  });

  describe('obtenerProductos', () => {
    beforeEach(async () => {
      await Producto.create([
        {
          nombre: 'Shampoo',
          descripcion: 'Para cabello',
          precio: 20,
          stock: 50,
          categoria: 'Cuidado del Cabello',
          activo: true
        },
        {
          nombre: 'Cera',
          descripcion: 'Para styling',
          precio: 15,
          stock: 30,
          categoria: 'Styling',
          activo: true
        },
        {
          nombre: 'Producto Inactivo',
          descripcion: 'No disponible',
          precio: 10,
          stock: 0,
          categoria: 'Accesorios',
          activo: false
        }
      ]);
    });

    it('debe retornar todos los productos sin filtros', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerProductos(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ nombre: 'Shampoo' }),
          expect.objectContaining({ nombre: 'Cera' }),
          expect.objectContaining({ nombre: 'Producto Inactivo' })
        ])
      );
    });

    it('debe filtrar productos por categoría', async () => {
      const req = { query: { categoria: 'Styling' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerProductos(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.length).toBe(1);
      expect(response[0].nombre).toBe('Cera');
    });

    it('debe filtrar productos activos', async () => {
      const req = { query: { activo: 'true' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerProductos(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.length).toBe(2);
      expect(response.every(p => p.activo === true)).toBe(true);
    });

    it('debe filtrar productos inactivos', async () => {
      const req = { query: { activo: 'false' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerProductos(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.length).toBe(1);
      expect(response[0].activo).toBe(false);
    });
  });

  describe('obtenerProducto', () => {
    let producto;

    beforeEach(async () => {
      producto = await Producto.create({
        nombre: 'Test Producto',
        descripcion: 'Descripción test',
        precio: 30,
        stock: 20,
        categoria: 'Cuidado del Cabello',
        activo: true
      });
    });

    it('debe retornar un producto por ID', async () => {
      const req = { params: { id: producto._id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerProducto(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Test Producto',
          precio: 30
        })
      );
    });

    it('debe retornar 400 para ID inválido', async () => {
      const req = { params: { id: 'id-invalido' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'ID de producto inválido'
      });
    });

    it('debe retornar 404 para producto inexistente', async () => {
      const req = { params: { id: '507f1f77bcf86cd799439011' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Producto no encontrado'
      });
    });
  });

  describe('actualizarProducto', () => {
    let producto;

    beforeEach(async () => {
      producto = await Producto.create({
        nombre: 'Producto Original',
        descripcion: 'Descripción original',
        precio: 25,
        stock: 50,
        categoria: 'Cuidado del Cabello',
        activo: true
      });
    });

    it('debe actualizar un producto exitosamente', async () => {
      const req = {
        params: { id: producto._id },
        body: {
          nombre: 'Producto Actualizado',
          precio: 30
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await actualizarProducto(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Producto actualizado',
          producto: expect.objectContaining({
            nombre: 'Producto Actualizado',
            precio: 30
          })
        })
      );
    });

    it('debe retornar 400 para ID inválido', async () => {
      const req = {
        params: { id: 'id-invalido' },
        body: { precio: 30 }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await actualizarProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'ID de producto inválido'
      });
    });

    it('debe retornar 404 para producto inexistente', async () => {
      const req = {
        params: { id: '507f1f77bcf86cd799439011' },
        body: { precio: 30 }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await actualizarProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Producto no encontrado'
      });
    });
  });

  describe('eliminarProducto', () => {
    let producto;

    beforeEach(async () => {
      producto = await Producto.create({
        nombre: 'Producto a Eliminar',
        descripcion: 'Test',
        precio: 25,
        stock: 50,
        categoria: 'Cuidado del Cabello',
        activo: true
      });
    });

    it('debe desactivar un producto (eliminación lógica)', async () => {
      const req = { params: { id: producto._id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await eliminarProducto(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Producto eliminado',
          producto: expect.objectContaining({
            activo: false
          })
        })
      );

      const productoEliminado = await Producto.findById(producto._id);
      expect(productoEliminado).toBeDefined();
      expect(productoEliminado.activo).toBe(false);
    });

    it('debe retornar 400 para ID inválido', async () => {
      const req = { params: { id: 'id-invalido' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await eliminarProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'ID de producto inválido'
      });
    });

    it('debe retornar 404 para producto inexistente', async () => {
      const req = { params: { id: '507f1f77bcf86cd799439011' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await eliminarProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Producto no encontrado'
      });
    });
  });
});
