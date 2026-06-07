const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  numeroPedido: {
    type: String,
    unique: true
  },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  productos: [{
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    precioUnitario: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  direccionEnvio: {
    type: String
  }
}, {
  timestamps: true
});

pedidoSchema.pre('save', async function(next) {
  if (!this.numeroPedido) {
    // Usar timestamp + random para evitar duplicados en tests paralelos
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.numeroPedido = `PED-${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Pedido', pedidoSchema);
