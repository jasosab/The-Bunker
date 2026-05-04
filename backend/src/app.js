const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Configurar trust proxy para Vercel
app.set('trust proxy', 1);

// Configuración de CORS para producción
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);

    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.CORS_ORIGIN,
      /\.vercel\.app$/  // Permite todos los subdominios de vercel.app
    ];

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));

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
