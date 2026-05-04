#!/bin/bash

# CONTROLADORES
cat > src/controllers/authController.js << 'EOF'
const Usuario = require('../models/Usuario');
const { generarToken } = require('../utils/jwt');

exports.registro = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, rol } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono,
      rol: rol || 'cliente'
    });

    const token = generarToken(usuario._id);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario desactivado' });
    }

    const token = generarToken(usuario._id);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};
EOF

cat > src/controllers/serviciosController.js << 'EOF'
const Servicio = require('../models/Servicio');

exports.obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find({ activo: true });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener servicios', error: error.message });
  }
};

exports.obtenerServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener servicio', error: error.message });
  }
};

exports.crearServicio = async (req, res) => {
  try {
    const servicio = await Servicio.create(req.body);
    res.status(201).json({ mensaje: 'Servicio creado', servicio });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear servicio', error: error.message });
  }
};

exports.actualizarServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json({ mensaje: 'Servicio actualizado', servicio });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar servicio', error: error.message });
  }
};

exports.eliminarServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json({ mensaje: 'Servicio eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar servicio', error: error.message });
  }
};
EOF

cat > src/controllers/citasController.js << 'EOF'
const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');

exports.obtenerMisCitas = async (req, res) => {
  try {
    const citas = await Cita.find({ clienteId: req.usuario.id })
      .populate('servicioId', 'nombre precio duracion')
      .populate('barberoId', 'nombre apellido')
      .sort({ fecha: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
};

exports.obtenerTodasCitas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('clienteId', 'nombre apellido telefono email')
      .populate('servicioId', 'nombre precio duracion')
      .populate('barberoId', 'nombre apellido')
      .sort({ fecha: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
};

exports.obtenerCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)
      .populate('clienteId', 'nombre apellido telefono email')
      .populate('servicioId', 'nombre precio duracion')
      .populate('barberoId', 'nombre apellido');
    
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json(cita);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cita', error: error.message });
  }
};

exports.crearCita = async (req, res) => {
  try {
    const { servicioId, fecha, hora, notas } = req.body;

    const servicio = await Servicio.findById(servicioId);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    const citaExistente = await Cita.findOne({
      fecha: new Date(fecha),
      hora,
      estado: { $in: ['confirmada', 'pendiente'] }
    });

    if (citaExistente) {
      return res.status(400).json({ mensaje: 'Ya existe una cita en ese horario' });
    }

    const cita = await Cita.create({
      clienteId: req.usuario.id,
      servicioId,
      fecha,
      hora,
      notas
    });

    const citaPopulada = await Cita.findById(cita._id)
      .populate('servicioId', 'nombre precio duracion');

    res.status(201).json({ mensaje: 'Cita creada exitosamente', cita: citaPopulada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cita', error: error.message });
  }
};

exports.actualizarCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('servicioId', 'nombre precio duracion');
    
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json({ mensaje: 'Cita actualizada', cita });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cita', error: error.message });
  }
};

exports.cancelarCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelada' },
      { new: true }
    );
    
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json({ mensaje: 'Cita cancelada', cita });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cancelar cita', error: error.message });
  }
};

exports.obtenerDisponibilidad = async (req, res) => {
  try {
    const { fecha, servicioId } = req.query;
    
    const horariosOcupados = await Cita.find({
      fecha: new Date(fecha),
      estado: { $in: ['confirmada', 'pendiente'] }
    }).select('hora');

    const horasOcupadas = horariosOcupados.map(c => c.hora);
    
    const horariosTotales = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30'
    ];

    const horariosDisponibles = horariosTotales.filter(h => !horasOcupadas.includes(h));

    res.json({ horariosDisponibles });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener disponibilidad', error: error.message });
  }
};
EOF

cat > src/controllers/productosController.js << 'EOF'
const Producto = require('../models/Producto');

exports.obtenerProductos = async (req, res) => {
  try {
    const { categoria, activo } = req.query;
    const filtro = {};
    
    if (categoria) filtro.categoria = categoria;
    if (activo !== undefined) filtro.activo = activo;

    const productos = await Producto.find(filtro);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

exports.obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json({ mensaje: 'Producto creado', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto actualizado', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
};
EOF

cat > src/controllers/pedidosController.js << 'EOF'
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

exports.obtenerMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ clienteId: req.usuario.id })
      .populate('productos.productoId', 'nombre precio')
      .sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
};

exports.obtenerTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('clienteId', 'nombre apellido email')
      .populate('productos.productoId', 'nombre precio')
      .sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
};

exports.obtenerPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('clienteId', 'nombre apellido email telefono')
      .populate('productos.productoId', 'nombre precio imagen');
    
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedido', error: error.message });
  }
};

exports.crearPedido = async (req, res) => {
  try {
    const { productos, direccionEnvio } = req.body;

    let total = 0;
    const productosValidados = [];

    for (const item of productos) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        return res.status(404).json({ mensaje: `Producto ${item.productoId} no encontrado` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${producto.nombre}` });
      }

      productosValidados.push({
        productoId: producto._id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      });

      total += producto.precio * item.cantidad;

      producto.stock -= item.cantidad;
      await producto.save();
    }

    const pedido = await Pedido.create({
      clienteId: req.usuario.id,
      productos: productosValidados,
      total,
      direccionEnvio
    });

    const pedidoPopulado = await Pedido.findById(pedido._id)
      .populate('productos.productoId', 'nombre precio');

    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido: pedidoPopulado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear pedido', error: error.message });
  }
};

exports.actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('productos.productoId', 'nombre precio');
    
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.json({ mensaje: 'Pedido actualizado', pedido });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar pedido', error: error.message });
  }
};
EOF

cat > src/controllers/usuariosController.js << 'EOF'
const Usuario = require('../models/Usuario');

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { password, ...datosActualizar } = req.body;
    
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario actualizado', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};
EOF

echo "✅ Controladores generados"
