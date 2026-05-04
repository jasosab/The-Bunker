#!/bin/bash

# APP.JS
cat > src/app.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones por ventana
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/citas', require('./routes/citas'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API de TheBunker funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
EOF

# MODELOS
cat > src/models/Servicio.js << 'EOF'
const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0
  },
  duracion: {
    type: Number,
    required: [true, 'La duración es obligatoria'],
    min: 15
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Servicio', servicioSchema);
EOF

cat > src/models/Cita.js << 'EOF'
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
EOF

cat > src/models/Producto.js << 'EOF'
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: 0,
    default: 0
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Cuidado del Cabello', 'Cuidado de la Barba', 'Styling', 'Accesorios', 'Kits']
  },
  imagen: {
    type: String
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);
EOF

cat > src/models/Pedido.js << 'EOF'
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
    const count = await mongoose.model('Pedido').countDocuments();
    this.numeroPedido = `PED-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Pedido', pedidoSchema);
EOF

# UTILS
cat > src/utils/jwt.js << 'EOF'
const jwt = require('jsonwebtoken');

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generarToken, verificarToken };
EOF

# MIDDLEWARE
cat > src/middleware/auth.js << 'EOF'
const { verificarToken } = require('../utils/jwt');
const Usuario = require('../models/Usuario');

exports.proteger = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ mensaje: 'No autorizado, no hay token' });
    }

    const decoded = verificarToken(token);
    if (!decoded) {
      return res.status(401).json({ mensaje: 'Token no válido' });
    }

    req.usuario = await Usuario.findById(decoded.id).select('-password');
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'No autorizado' });
  }
};

exports.autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: `El rol ${req.usuario.rol} no tiene permisos para esta acción`
      });
    }
    next();
  };
};
EOF

cat > src/middleware/validar.js << 'EOF'
const { validationResult } = require('express-validator');

exports.validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};
EOF

echo "✅ Backend generado completamente"
