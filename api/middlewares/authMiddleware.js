// ===================== Importaciones =====================
const { User, Role, Permission, Entity } = require('../models');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

// ===================== Middlewares =====================

// Verificación de tokens
async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization
        if (!token)
            return res.status(400).json({ message: 'No se envió token' });

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log("se fallo el acceso por token");
                return res.status(401).json({ message: 'Token inválido o expirado' });

            }

            const user = await User.findByPk(decoded.id, {
                include: {
                    model: Role,
                    as: 'role',
                    include: {
                        model: Permission,
                        as: 'permissions'
                    }
                }
            });
            if (!user)
                return res.status(404).json({ message: 'Usuario no encontrado' });

            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                school_id: user.school_id
            }

            next()
        });
    } catch (err) {
        console.error("Error en middleware token:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

// Autorización de roles
function authorizeRole(roles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
        }

        next();
    };
}

function checkPermission(entity_id, action_id) {
    return async (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Usuario no autenticado" });

        try {
            //causa
            const role = req.user.role;

            if (!role)
                return res.status(404).json({ message: "Rol no encontrado" });

            const entity = await Entity.findByPk(entity_id, {
                attributes: ['name']
            });

            if (!entity)
                return res.status(404).json({ message: "Entidad no encontrada" });

            req.table = entity.name;

            const hasPermission = role.permissions?.some(p => p.entity_id === entity_id && p.action_id === action_id);

            console.log(hasPermission);

            if (!hasPermission)
                return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al verificar permisos" });
        }
    }
}

// ===================== Exportaciones =====================
module.exports = {
    verifyToken,
    authorizeRole,
    checkPermission
}