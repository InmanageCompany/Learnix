// ===================== Importaciones =====================
const { User, Role } = require('../models');
const Course = require('../models/Course');

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
    
    req.create = role,
    req.result = { message: 'Rol creado correctamente', role };

    //res.status(201).json({ message: 'Rol creado correctamente', role});
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

    if (!roles)
      return res.status(400).json('No hay roles registrados');

    res.status(200).json(roles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
}

// Crear usuario
const createUser = async (req, res) => {
  try {
    const { role_id, name, date_of_birth, phone, cuil, tuition, email } = req.body;

    if (!role_id || !name || !date_of_birth || !phone || !cuil || !tuition || !email)
      return res.status(400).json({ message: 'Faltan datos obligatorios' });

    if (isNaN(role_id) || parseInt(role_id) <= 0)
      return res.status(400).json({ message: 'El ID de rol debe ser un número entero válido' });

    if (isNaN(Date.parse(date_of_birth)))
      return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });

    if (isNaN(tuition))
      return res.status(400).json({ message: 'La matrícula debe ser un número válido' });

    const role = await Role.findByPk(role_id);
    if (!role)
      return res.status(404).json({ message: 'Rol no encontrado' });

    const user = await User.create({
      role_id,
      name,
      date_of_birth,
      phone,
      cuil,
      tuition,
      email
    });

    res.status(201).json({ message: `Usuario creado correctamente con rol '${role.name}'`, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Borrar usuario
const deleteUser = async (req, res, next) => {
  try {
    const {idD} = req.params;

    if (!idD)
      return res.status(400).json({ message: 'Debe proporcionar un ID válido' });

    if (isNaN(idD) || parseInt(idD) <= 0)
      return res.status(400).json({ message: 'El ID debe ser un número entero válido' });
    
    const result = await User.destroy({ where: { id: parseInt(idD) } });

    // `destroy` devuelve el número de filas eliminadas
    if (result === 0)
      return res.status(404).json({ message: 'El ID del usuario no existe' });
    
    req.result = { message: 'Usuario eliminado correctamente' };

    //return res.json({ message: 'Usuario eliminado correctamente' });
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

const getUsers = async (req, res) => {
  try{
    const cantidadActivos = await User.count({ where: { isActive: true }});
    res.json({cantidadActivos});
  }
  catch(err){
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
}

const getCourses = async (req, res) => {
  try{
    const cursos = await Course.count();
    res.json({cursos});
  }
  catch(err){
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
}



// ===================== Exportaciones =====================
module.exports = {
  getUsers,
  createRole,
  roleList,
  createUser,
  deleteUser,
  getCourses
}