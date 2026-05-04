const Usuario = require('../../models/Usuario');
const { registro, login, obtenerPerfil } = require('../../controllers/authController');
const { generarToken } = require('../../utils/jwt');

require('../setup');

jest.mock('../../utils/jwt');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generarToken.mockReturnValue('mocked-token-12345');
  });

  describe('registro', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const req = {
        body: {
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          password: 'password123',
          telefono: '1234567890'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await registro(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Usuario registrado exitosamente',
          token: 'mocked-token-12345',
          usuario: expect.objectContaining({
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            rol: 'cliente'
          })
        })
      );
    });

    it('debe establecer el rol por defecto como cliente si no se proporciona', async () => {
      const req = {
        body: {
          nombre: 'María García',
          email: 'maria@example.com',
          password: 'password123',
          telefono: '0987654321'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await registro(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario: expect.objectContaining({
            rol: 'cliente'
          })
        })
      );
    });

    it('debe rechazar registro con email duplicado', async () => {
      const usuarioData = {
        nombre: 'Pedro López',
        email: 'pedro@example.com',
        password: 'password123',
        telefono: '1122334455'
      };

      await Usuario.create(usuarioData);

      const req = {
        body: usuarioData
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await registro(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'El email ya está registrado'
      });
    });

    it('debe permitir registrar usuario con rol específico', async () => {
      const req = {
        body: {
          nombre: 'Carlos Barbero',
          email: 'carlos@example.com',
          password: 'password123',
          telefono: '5544332211',
          rol: 'barbero'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await registro(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario: expect.objectContaining({
            rol: 'barbero'
          })
        })
      );
    });
  });

  describe('login', () => {
    let usuarioTest;

    beforeEach(async () => {
      usuarioTest = await Usuario.create({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        telefono: '1234567890',
        activo: true
      });
    });

    it('debe iniciar sesión exitosamente con credenciales válidas', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Login exitoso',
          token: 'mocked-token-12345',
          usuario: expect.objectContaining({
            email: 'test@example.com'
          })
        })
      );
    });

    it('debe rechazar login con email inválido', async () => {
      const req = {
        body: {
          email: 'noexiste@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Credenciales inválidas'
      });
    });

    it('debe rechazar login con password incorrecto', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'passwordIncorrecto'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Credenciales inválidas'
      });
    });

    it('debe rechazar login de usuario desactivado', async () => {
      await Usuario.findByIdAndUpdate(usuarioTest._id, { activo: false });

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Usuario desactivado'
      });
    });

    it('debe manejar email en mayúsculas correctamente', async () => {
      const req = {
        body: {
          email: 'TEST@EXAMPLE.COM',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Login exitoso',
          token: 'mocked-token-12345'
        })
      );
    });
  });

  describe('obtenerPerfil', () => {
    let usuarioTest;

    beforeEach(async () => {
      usuarioTest = await Usuario.create({
        nombre: 'Perfil Test',
        email: 'perfil@example.com',
        password: 'password123',
        telefono: '1234567890'
      });
    });

    it('debe retornar el perfil del usuario autenticado', async () => {
      const req = {
        usuario: {
          id: usuarioTest._id
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerPerfil(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Perfil Test',
          email: 'perfil@example.com'
        })
      );
    });

    it('debe retornar 404 si el usuario no existe', async () => {
      const req = {
        usuario: {
          id: '507f1f77bcf86cd799439011'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerPerfil(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Usuario no encontrado'
      });
    });
  });
});
