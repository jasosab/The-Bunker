const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');

exports.obtenerMisCitas = async (req, res) => {
  try {
    const citas = await Cita.find({ clienteId: req.usuario.id })
      .populate('servicioId', 'nombre precio duracion')
      .populate('barberoId', 'nombre apellido')
      .sort({ fecha: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
};

exports.obtenerTodasCitas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('clienteId', 'nombre apellido telefono email')
      .populate('servicioId', 'nombre precio duracion')
      .populate('barberoId', 'nombre apellido')
      .sort({ fecha: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
};

exports.obtenerCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)
      .populate('clienteId', 'nombre apellido telefono email')
      .populate('servicioId', 'nombre precio duracion')
      .populate('barberoId', 'nombre apellido');
    
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json(cita);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cita', error: error.message });
  }
};

exports.crearCita = async (req, res) => {
  try {
    const { servicioId, fecha, hora, notas } = req.body;

    // Verificar que el servicio existe
    const servicio = await Servicio.findById(servicioId);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    // Verificar que el servicio está activo
    if (!servicio.activo) {
      return res.status(400).json({ mensaje: 'El servicio no está disponible' });
    }

    // Verificar disponibilidad de horario
    const citaExistente = await Cita.findOne({
      fecha: new Date(fecha),
      hora,
      estado: { $in: ['confirmada', 'pendiente'] }
    });

    if (citaExistente) {
      return res.status(400).json({ mensaje: 'Ya existe una cita en ese horario' });
    }

    // Crear la cita
    const cita = await Cita.create({
      clienteId: req.usuario.id,
      servicioId,
      fecha,
      hora,
      notas,
      estado: 'confirmada'
    });

    const citaPopulada = await Cita.findById(cita._id)
      .populate('servicioId', 'nombre precio duracion');

    res.status(201).json({ mensaje: 'Cita creada exitosamente', cita: citaPopulada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cita', error: error.message });
  }
};

exports.actualizarCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('servicioId', 'nombre precio duracion');
    
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json({ mensaje: 'Cita actualizada', cita });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cita', error: error.message });
  }
};

exports.cancelarCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelada' },
      { new: true }
    );
    
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json({ mensaje: 'Cita cancelada', cita });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cancelar cita', error: error.message });
  }
};

exports.obtenerDisponibilidad = async (req, res) => {
  try {
    const { fecha, servicioId } = req.query;
    
    const horariosOcupados = await Cita.find({
      fecha: new Date(fecha),
      estado: { $in: ['confirmada', 'pendiente'] }
    }).select('hora');

    const horasOcupadas = horariosOcupados.map(c => c.hora);
    
    const horariosTotales = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30'
    ];

    const horariosDisponibles = horariosTotales.filter(h => !horasOcupadas.includes(h));

    res.json({ horariosDisponibles });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener disponibilidad', error: error.message });
  }
};
