const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Cargar variables de entorno para las pruebas
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRE = '1h';
process.env.NODE_ENV = 'test';

let mongoServer;

// Configuración antes de todas las pruebas
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

// Limpiar después de cada prueba
afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Cerrar conexiones después de todas las pruebas
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
