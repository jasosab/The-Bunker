const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validarCampos } = require('../middleware/validar');
const { proteger } = require('../middleware/auth');
const { registro, login, obtenerPerfil } = require('../controllers/authController');

router.post('/registro', [
  body('nombre', 'El nombre es obligatorio').notEmpty(),
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
