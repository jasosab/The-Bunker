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
