#!/bin/bash

# RUTAS
cat > src/routes/auth.js << 'EOF'
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validarCampos } = require('../middleware/validar');
const { proteger } = require('../middleware/auth');
const { registro, login, obtenerPerfil } = require('../controllers/authController');

router.post('/registro', [
  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('apellido', 'El apellido es obligatorio').notEmpty(),
  body('email', 'Email inválido').isEmail(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  body('telefono', 'El teléfono es obligatorio').notEmpty(),
  validarCampos
], registro);

router.post('/login', [
  body('email', 'Email inválido').isEmail(),
  body('password', 'La contraseña es obligatoria').notEmpty(),
  validarCampos
], login);

router.get('/perfil', proteger, obtenerPerfil);

module.exports = router;
EOF

cat > src/routes/servicios.js << 'EOF'
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validarCampos } = require('../middleware/validar');
const { proteger, autorizarRoles } = require('../middleware/auth');
const {
  obtenerServicios,
  obtenerServicio,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/serviciosController');

router.get('/', obtenerServicios);
router.get('/:id', obtenerServicio);

router.post('/', [
  proteger,
  autorizarRoles('admin', 'recepcionista'),
  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('descripcion', 'La descripción es obligatoria').notEmpty(),
  body('precio', 'El precio debe ser un número positivo').isFloat({ min: 0 }),
  body('duracion', 'La duración debe ser un número positivo').isInt({ min: 15 }),
  validarCampos
], crearServicio);

router.put('/:id', [
  proteger,
  autorizarRoles('admin', 'recepcionista'),
  validarCampos
], actualizarServicio);

router.delete('/:id', [
  proteger,
  autorizarRoles('admin', 'recepcionista')
], eliminarServicio);

module.exports = router;
EOF

cat > src/routes/citas.js << 'EOF'
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validarCampos } = require('../middleware/validar');
const { proteger, autorizarRoles } = require('../middleware/auth');
const {
  obtenerMisCitas,
  obtenerTodasCitas,
  obtenerCita,
  crearCita,
  actualizarCita,
  cancelarCita,
  obtenerDisponibilidad
} = require('../controllers/citasController');

router.get('/mis-citas', proteger, obtenerMisCitas);
router.get('/disponibilidad', obtenerDisponibilidad);
router.get('/:id', proteger, obtenerCita);

router.get('/', [
  proteger,
  autorizarRoles('admin', 'recepcionista', 'barbero')
], obtenerTodasCitas);

router.post('/', [
  proteger,
  body('servicioId', 'El servicio es obligatorio').notEmpty(),
  body('fecha', 'La fecha es obligatoria').notEmpty(),
  body('hora', 'La hora es obligatoria').notEmpty(),
  validarCampos
], crearCita);

router.put('/:id', [
  proteger,
  autorizarRoles('admin', 'recepcionista', 'barbero'),
  validarCampos
], actualizarCita);

router.put('/:id/cancelar', proteger, cancelarCita);

module.exports = router;
EOF

cat > src/routes/productos.js << 'EOF'
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validarCampos } = require('../middleware/validar');
const { proteger, autorizarRoles } = require('../middleware/auth');
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productosController');

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);

router.post('/', [
  proteger,
  autorizarRoles('admin', 'recepcionista'),
  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('descripcion', 'La descripción es obligatoria').notEmpty(),
  body('precio', 'El precio debe ser un número positivo').isFloat({ min: 0 }),
  body('stock', 'El stock debe ser un número positivo').isInt({ min: 0 }),
  body('categoria', 'La categoría es obligatoria').notEmpty(),
  validarCampos
], crearProducto);

router.put('/:id', [
  proteger,
  autorizarRoles('admin', 'recepcionista'),
  validarCampos
], actualizarProducto);

router.delete('/:id', [
  proteger,
  autorizarRoles('admin', 'recepcionista')
], eliminarProducto);

module.exports = router;
EOF

cat > src/routes/pedidos.js << 'EOF'
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validarCampos } = require('../middleware/validar');
const { proteger, autorizarRoles } = require('../middleware/auth');
const {
  obtenerMisPedidos,
  obtenerTodosPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido
} = require('../controllers/pedidosController');

router.get('/mis-pedidos', proteger, obtenerMisPedidos);
router.get('/:id', proteger, obtenerPedido);

router.get('/', [
  proteger,
  autorizarRoles('admin', 'recepcionista')
], obtenerTodosPedidos);

router.post('/', [
  proteger,
  body('productos', 'Los productos son obligatorios').isArray({ min: 1 }),
  validarCampos
], crearPedido);

router.put('/:id', [
  proteger,
  autorizarRoles('admin', 'recepcionista'),
  validarCampos
], actualizarPedido);

module.exports = router;
EOF

cat > src/routes/usuarios.js << 'EOF'
const express = require('express');
const router = express.Router();
const { validarCampos } = require('../middleware/validar');
const { proteger, autorizarRoles } = require('../middleware/auth');
const {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuariosController');

router.use(proteger);
router.use(autorizarRoles('admin'));

router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
EOF

echo "✅ Rutas generadas"
