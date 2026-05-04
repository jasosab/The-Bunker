require('dotenv').config();
const app = require('./app');
const conectarDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
conectarDB();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
