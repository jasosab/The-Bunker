const Cita = require('../../models/Cita');
const Servicio = require('../../models/Servicio');
const Usuario = require('../../models/Usuario');
const {
  obtenerMisCitas,
  obtenerTodasCitas,
  obtenerCita,
  crearCita,
  actualizarCita,
  cancelarCita,
  obtenerDisponibilidad
} = require('../../controllers/citasController');

require('../setup');

describe('CitasController', () => {
  let usuario, barbero, servicio;

  beforeEach(async () => {
    usuario = await Usuario.create({
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

    servicio = await Servicio.create({
      nombre: 'Corte de cabello',
      descripcion: 'Corte clásico',
      precio: 15,
      duracion: 30,
      activo: true
    });
  });

  describe('crearCita', () => {
    it('debe crear una cita exitosamente', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00',
          notas: 'Primera cita'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Cita creada exitosamente',
          cita: expect.objectContaining({
            hora: '10:00'
          })
        })
      );
    });

    it('debe rechazar cita con servicio inexistente', async () => {
      const req = {
        usuario: { id: usuario._id },
        body: {
          servicioId: '507f1f77bcf86cd799439011',
          fecha: '2025-12-15',
          hora: '10:00'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Servicio no encontrado'
      });
    });

    it('debe rechazar cita con servicio inactivo', async () => {
      await Servicio.findByIdAndUpdate(servicio._id, { activo: false });

      const req = {
        usuario: { id: usuario._id },
        body: {
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'El servicio no está disponible'
      });
    });

    it('debe rechazar cita en horario ya ocupado', async () => {
      await Cita.create({
        clienteId: usuario._id,
        servicioId: servicio._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'confirmada'
      });

      const req = {
        usuario: { id: usuario._id },
        body: {
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Ya existe una cita en ese horario'
      });
    });

    it('debe permitir crear cita en horario con cita cancelada', async () => {
      await Cita.create({
        clienteId: usuario._id,
        servicioId: servicio._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'cancelada'
      });

      const req = {
        usuario: { id: usuario._id },
        body: {
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Cita creada exitosamente'
        })
      );
    });
  });

  describe('obtenerMisCitas', () => {
    it('debe retornar las citas del usuario autenticado', async () => {
      await Cita.create([
        {
          clienteId: usuario._id,
          servicioId: servicio._id,
          barberoId: barbero._id,
          fecha: '2025-12-15',
          hora: '10:00',
          estado: 'confirmada'
        },
        {
          clienteId: usuario._id,
          servicioId: servicio._id,
          barberoId: barbero._id,
          fecha: '2025-12-16',
          hora: '11:00',
          estado: 'pendiente'
        }
      ]);

      const req = {
        usuario: { id: usuario._id }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerMisCitas(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            hora: '10:00'
          }),
          expect.objectContaining({
            hora: '11:00'
          })
        ])
      );
    });
  });

  describe('obtenerDisponibilidad', () => {
    it('debe retornar horarios disponibles correctamente', async () => {
      await Cita.create([
        {
          clienteId: usuario._id,
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '10:00',
          estado: 'confirmada'
        },
        {
          clienteId: usuario._id,
          servicioId: servicio._id,
          fecha: '2025-12-15',
          hora: '14:00',
          estado: 'confirmada'
        }
      ]);

      const req = {
        query: {
          fecha: '2025-12-15',
          servicioId: servicio._id
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerDisponibilidad(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          horariosDisponibles: expect.arrayContaining([
            '09:00',
            '09:30',
            '10:30',
            '11:00'
          ])
        })
      );

      const response = res.json.mock.calls[0][0];
      expect(response.horariosDisponibles).not.toContain('10:00');
      expect(response.horariosDisponibles).not.toContain('14:00');
    });

    it('debe retornar todos los horarios si no hay citas', async () => {
      const req = {
        query: {
          fecha: '2025-12-20',
          servicioId: servicio._id
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerDisponibilidad(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.horariosDisponibles.length).toBeGreaterThan(20);
    });
  });

  describe('cancelarCita', () => {
    it('debe cancelar una cita exitosamente', async () => {
      const cita = await Cita.create({
        clienteId: usuario._id,
        servicioId: servicio._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'confirmada'
      });

      const req = {
        params: { id: cita._id }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await cancelarCita(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensaje: 'Cita cancelada',
          cita: expect.objectContaining({
            estado: 'cancelada'
          })
        })
      );
    });

    it('debe retornar 404 para cita inexistente', async () => {
      const req = {
        params: { id: '507f1f77bcf86cd799439011' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await cancelarCita(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Cita no encontrada'
      });
    });
  });

  describe('obtenerCita', () => {
    it('debe retornar una cita por ID', async () => {
      const cita = await Cita.create({
        clienteId: usuario._id,
        servicioId: servicio._id,
        barberoId: barbero._id,
        fecha: '2025-12-15',
        hora: '10:00',
        estado: 'confirmada'
      });

      const req = {
        params: { id: cita._id }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerCita(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          hora: '10:00',
          estado: 'confirmada'
        })
      );
    });
  });
});
