const User = require('../models/user');
const bcrypt = require('bcrypt');

// Controlador ligero de usuarios: operaciones CRUD básicas con validaciones mínimas.

exports.getAllUsers = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { active: { $ne: false } };

    let users;
    if (req.userRole === 'auxiliar') {
      users = await User.find({ _id: req.userId, ...filter }).select('-password');
    } else {
      users = await User.find(filter).select('-password');
    }

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error('[userControllers] getAllUsers error', err);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const found = await User.findById(req.params.id).select('-password');
    if (!found) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // restricciones de rol
    if (req.userRole === 'auxiliar' && req.userId !== found._id.toString()) {
      return res.status(403).json({ success: false, message: 'Sin permiso' });
    }
    if (req.userRole === 'coordinador' && found.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Sin permiso para ver admins' });
    }

    res.status(200).json({ success: true, data: found });
  } catch (err) {
    console.error('[userControllers] getUserById error', err);
    res.status(500).json({ success: false, message: 'Error al obtener usuario' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Campos obligatorios faltan' });
    }

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Usuario ya existe' });
    }

    const newUser = new User({ username, email, password, role });
    const saved = await newUser.save();
    res.status(201).json({ success: true, data: { id: saved._id, username: saved.username, email: saved.email, role: saved.role } });
  } catch (err) {
    console.error('[userControllers] createUser error', err);
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.userRole === 'auxiliar' && req.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Sin permiso para actualizar' });
    }
    if (req.userRole === 'auxiliar' && req.body.role) {
      return res.status(403).json({ success: false, message: 'Auxiliar no puede cambiar rol' });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-password');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('[userControllers] updateUser error', err);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const isHard = req.query.hardDelete === 'true';
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    if (target.role === 'admin' && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'No puede eliminar admin' });
    }

    if (isHard) {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Usuario eliminado permanentemente' });
    } else {
      target.active = false;
      await target.save();
      return res.status(200).json({ success: true, message: 'Usuario desactivado' });
    }
  } catch (err) {
    console.error('[userControllers] deleteUser error', err);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
};
