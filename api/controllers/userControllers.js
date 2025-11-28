// ===================== Importaciones =====================
const { User, Role, School } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config/jwt');

// ===================== Controladores =====================

// Login
const login = async (req, res) => {
    const { cuil, tuition, email, password } = req.body;

    try {
        if ((cuil || tuition) && (email || password))
            return res.status(400).json({ message: 'Use solo un método de login a la vez' });


        if (cuil !== undefined && tuition !== undefined) {
            if (!Number.isInteger(cuil) || cuil <= 0 || !Number.isInteger(tuition) || tuition <= 0) {
                return res.status(400).json({ message: 'CUIL y matrícula deben ser números enteros positivos' });
            }

            const user = await User.findOne({
                where: { cuil },
                include: [{ model: Role, as: 'role' }]
            });

            if (!user)
                return res.status(404).json({ message: 'Usuario no encontrado' });

            if (user.tuition !== tuition)
                return res.status(401).json({ message: 'Matrícula incorrecta' });

            const token = jwt.sign({ id: user.id, role: user.role?.name }, JWT_SECRET, { expiresIn: '1h' });

            return res.json({ token, role: user.role?.name });
        }

        if (email && password) {

            const user = await User.findOne({
                where: { email },
                include: [{ model: Role, as: 'role' }]
            });

            if (!user)
                return res.status(404).json({ message: 'Usuario no encontrado' });

            if (!(await bcrypt.compare(password, user.password)))
                return res.status(401).json({ message: 'Contraseña incorrecta' });

            const token = jwt.sign({ id: user.id, role: user.role?.name }, JWT_SECRET);

            return res.json({ token, role: user.role?.name });
        }

        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
};

// Información de usuario
const infoUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });

        req.result = user.toJSON();

        //res.json(user);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener información del usuario' });
    }
};

// Actualizar usuario
const updateUser = async (req, res, next) => {
    const { name, date_of_birth, phone, cuil, tuition, email, password } = req.body;
    const changes = {};
    const verif = req.verif;
    
    //cosas a usar
    // console.log(typeof phone[0] === 'string');
    // console.log(isNaN(Number('pepe')));
    try {
        if (name) changes.name = name;
        if (date_of_birth){
            if (isNaN(Date.parse(date_of_birth)))
            return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });
            changes.date_of_birth = date_of_birth;
        }
        if (phone) {
            if (isNaN(phone)) return res.status(400).json({ message: 'El numero tiene que ser numero' });
            if (phone[0] === 0) return res.status(400).json({ message: 'el numero de telefono no puede empezar por cero' });
            changes.phone = phone;
        }
        if (cuil) {
            if (isNaN(cuil)) return res.status(400).json({ message: 'El cuil tiene que ser un numero' });
            changes.cuil = cuil;
            
        }
        if (tuition) {
            if (isNaN(tuition)) return res.status(400).json({ message: 'La matricula tiene que ser un numero' });
            changes.tuition = tuition;
        }
        if (email) {
            if (!email.includes("@")) {
                return res.status(400).json({ message: 'El email no es válido' });
            }
            changes.email = email;
        }
        
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            changes.password = passwordHash;
        }

        if (Object.keys(changes).length === 0)
            return res.status(400).json({ message: 'Ingrese al menos un valor a modificar' });


         const [updated] = await User.update(changes, {
            where: { id: verif }
        });

        if(updated === 0) return res.status(400).json({ message: 'No se modifico ningun ususario' })

        req.facts = changes;
        req.result = { message: 'Se actualizó el usuario correctamente' };

        //res.json({ message: 'Se actualizó el usuario correctamente' })
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor', error: err });
    }
};

// Obtener todas las escuelas
const getSchools = async (req, res) => {
    try {
        const schools = await School.findAll({
            attributes: ["id", "name"]
        });

        res.json(schools);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = { getSchools };

// ===================== Exportaciones =====================
module.exports = {
    login,
    infoUser,
    updateUser,
    getSchools
}