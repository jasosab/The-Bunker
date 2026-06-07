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
