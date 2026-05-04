const mongoose = require('mongoose');

// Variable para cachear la conexión en entornos serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const conectarDB = async () => {
  // Si ya hay una conexión activa, reutilizarla
  if (cached.conn) {
    console.log('🔄 Usando conexión MongoDB cacheada');
    return cached.conn;
  }

  // Si no hay una promesa de conexión, crear una nueva
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`✅ MongoDB conectado: ${mongoose.connection.host}`);
        return mongoose;
      })
      .catch((error) => {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        cached.promise = null; // Reset en caso de error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

module.exports = conectarDB;
