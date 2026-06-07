const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  barberoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  servicioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  hora: {
    type: String,
    required: [true, 'La hora es obligatoria']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
    default: 'confirmada'
  },
  notas: {
    type: String
  }
}, {
  timestamps: true
});

citaSchema.index({ fecha: 1, hora: 1, barberoId: 1 });

module.exports = mongoose.model('Cita', citaSchema);
