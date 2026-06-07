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
