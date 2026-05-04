require('dotenv').config();
const app = require('./app');
const conectarDB = require('./config/database');

// Conectar a la base de datos
conectarDB();

// Exportar la app para Vercel (serverless)
module.exports = app;
