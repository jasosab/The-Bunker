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
