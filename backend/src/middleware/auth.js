const { verificarToken } = require('../utils/jwt');
const Usuario = require('../models/Usuario');

exports.proteger = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ mensaje: 'No autorizado, no hay token' });
    }

    const decoded = verificarToken(token);
    if (!decoded) {
      return res.status(401).json({ mensaje: 'Token no válido' });
    }

    req.usuario = await Usuario.findById(decoded.id).select('-password');
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'No autorizado' });
  }
};

exports.autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: `El rol ${req.usuario.rol} no tiene permisos para esta acción`
      });
    }
    next();
  };
};
