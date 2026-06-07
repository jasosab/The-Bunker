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
