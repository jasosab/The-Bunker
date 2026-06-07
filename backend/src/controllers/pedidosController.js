const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');
const mongoose = require('mongoose');

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
      .populate('clienteId', 'nombre email')
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
      .populate('clienteId', 'nombre email telefono')
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

    // Validar que se envíen productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Debe incluir al menos un producto' });
    }

    let total = 0;
    const productosValidados = [];

    for (const item of productos) {
      // Validar que cantidad sea positiva
      if (!item.cantidad || item.cantidad <= 0) {
        return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a 0' });
      }

      // Validar que el ID del producto sea válido
      if (!mongoose.Types.ObjectId.isValid(item.productoId)) {
        return res.status(400).json({ mensaje: 'ID de producto inválido' });
      }

      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        return res.status(404).json({ mensaje: `Producto ${item.productoId} no encontrado` });
      }

      // Verificar que el producto esté activo
      if (!producto.activo) {
        return res.status(400).json({ mensaje: `El producto ${producto.nombre} no está disponible` });
      }

      // Verificar stock suficiente
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}` });
      }

      productosValidados.push({
        productoId: producto._id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      });

      total += producto.precio * item.cantidad;

      // Reducir stock
      producto.stock -= item.cantidad;
      await producto.save();
    }

    const pedido = await Pedido.create({
      clienteId: req.usuario.id,
      productos: productosValidados,
      total,
      direccionEnvio,
      estado: 'pendiente'
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
