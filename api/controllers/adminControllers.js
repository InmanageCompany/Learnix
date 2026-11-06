// ===================== Importaciones =====================
const { User, Role } = require('../models');
const bcrypt = require('bcrypt');

// ===================== Controladores =====================

// Crear roles
const createRole = async (req, res, next) => {
  try {
    const name = req.body.name;

    if (!name || typeof name !== 'string')
      return res.status(400).json({ message: 'Debe enviar un nombre válido' });

    const lowerCaseName = name.trim().toLowerCase();

    const existingRole = await Role.findOne({ where: { name: lowerCaseName } });
    if (existingRole)
      return res.status(400).json({ message: 'El rol ya existe' });

    const role = await Role.create({ name: lowerCaseName });

    req.create = role;
    req.result = { message: 'Rol creado correctamente', role };
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Lista de roles
const roleList = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Crear usuario
const createUser = async (req, res, next) => {
  try {
    const { role_id, name, date_of_birth, phone, cuil, tuition, email, password } = req.body;

    if (!role_id || !name || !date_of_birth || !phone || !cuil)
      return res.status(400).json({ message: 'Faltan datos obligatorios' });

    if (isNaN(role_id) || parseInt(role_id) <= 0)
      return res.status(400).json({ message: 'El ID de rol debe ser un número entero válido' });

    if (isNaN(Date.parse(date_of_birth)))
      return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });

    const role = await Role.findByPk(role_id);
    if (!role)
      return res.status(404).json({ message: 'Rol no encontrado' });

    // La escuela del nuevo usuario es la del admin que lo crea
    const admin = await User.findByPk(req.user.id);

    if (!admin?.school_id)
      return res.status(400).json({ message: 'Tu cuenta de administrador no tiene escuela asignada' });

    // Estudiantes: entran con cuil + matrícula. Resto: email + contraseña
    const isStudent = role.name === 'student';

    if (isStudent) {
      if (!tuition || isNaN(tuition))
        return res.status(400).json({ message: 'La matrícula es obligatoria y debe ser un número válido' });
    } else {
      if (!email || !password)
        return res.status(400).json({ message: 'Email y contraseña son obligatorios para este rol' });
    }

    const user = await User.create({
      role_id,
      school_id: admin.school_id,
      name,
      date_of_birth,
      phone,
      cuil,
      tuition: isStudent ? tuition : null,
      email: email || null,
      password: isStudent ? null : await bcrypt.hash(password, 10)
    });

    // Copia sin la contraseña, para la respuesta y la bitácora
    const { password: _omit, ...safeUser } = user.toJSON();

    req.create = safeUser;
    req.result = { message: `Usuario creado correctamente con rol '${role.name}'`, user: safeUser };
    next();
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ message: 'CUIL, email o matrícula ya registrados' });
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Modificar usuario
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id) || parseInt(id) <= 0)
      return res.status(400).json({ message: 'El ID debe ser un número entero válido' });

    const user = await User.findByPk(parseInt(id));
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const { role_id, name, date_of_birth, phone, cuil, tuition, email, password } = req.body;

    if (date_of_birth && isNaN(Date.parse(date_of_birth)))
      return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });

    if (tuition && isNaN(tuition))
      return res.status(400).json({ message: 'La matrícula debe ser un número válido' });

    // Solo actualizamos lo que realmente llegó
    const fields = { role_id, name, date_of_birth, phone, cuil, tuition, email };
    Object.keys(fields).forEach((k) => (fields[k] === undefined || fields[k] === "") && delete fields[k]);

    if (password) fields.password = await bcrypt.hash(password, 10);

    // El rol final (el nuevo si lo cambió, el actual si no)
    const targetRole = await Role.findByPk(role_id || user.role_id);
    if (!targetRole)
      return res.status(404).json({ message: 'Rol no encontrado' });

    // Que el usuario pueda seguir iniciando sesión con su rol
    if (targetRole.name === 'student') {
      if (!(fields.tuition ?? user.tuition))
        return res.status(400).json({ message: 'Un estudiante necesita matrícula' });
    } else {
      if (!(fields.email ?? user.email) || !(fields.password ?? user.password))
        return res.status(400).json({ message: 'Este rol necesita email y contraseña' });
    }

    await user.update(fields);

    const { password: _omit, ...safeUser } = user.toJSON();
    req.result = { message: 'Usuario actualizado correctamente', user: safeUser };
    next();
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ message: 'CUIL, email o matrícula ya registrados' });
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Suspender usuario (baja lógica): no borra, solo desactiva
const deleteUser = async (req, res, next) => {
  try {
    const { idD } = req.params;

    if (isNaN(idD) || parseInt(idD) <= 0)
      return res.status(400).json({ message: 'El ID debe ser un número entero válido' });

    // Evita que el admin se deje afuera a sí mismo
    if (req.user && parseInt(idD) === req.user.id)
      return res.status(400).json({ message: 'No podés suspender tu propia cuenta' });

    const user = await User.findByPk(parseInt(idD));
    if (!user)
      return res.status(404).json({ message: 'El ID del usuario no existe' });

    await user.update({ isActive: false });

    req.result = { message: 'Usuario suspendido correctamente' };
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Reactivar usuario
const reactivateUser = async (req, res, next) => {
  try {
    const { idD } = req.params;

    if (isNaN(idD) || parseInt(idD) <= 0)
      return res.status(400).json({ message: 'El ID debe ser un número entero válido' });

    const user = await User.findByPk(parseInt(idD));
    if (!user)
      return res.status(404).json({ message: 'El ID del usuario no existe' });

    await user.update({ isActive: true });

    req.facts = { isActive: true };
    req.result = { message: 'Usuario reactivado correctamente', id: user.id };
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Cantidad de usuarios activos (Home del admin)
const getUsers = async (req, res) => {
  try {
    const cantidadActivos = await User.count({ where: { isActive: true } });
    res.json({ cantidadActivos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Lista de usuarios con su rol (pantalla Usuarios)
const users = async (req, res) => {
  try {
    const data = await User.findAll({
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
      attributes: { exclude: ['password'] }
    });

    return res.json(data); // si no hay usuarios devuelve [], sin error
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// ===================== Exportaciones =====================
module.exports = {
  getUsers,
  users,
  createRole,
  roleList,
  createUser,
  updateUser,
  deleteUser,
  reactivateUser
};