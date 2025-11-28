// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const Binnacle = require('../middlewares/Binnacle')
const userControllers = require('../controllers/userControllers')

// ===================== Rutas =====================

// Ruta para login
router.post('/login', userControllers.login);

// Ruta para información de usuario
//router.get('/info', authMiddleware.verifyToken, userControllers.infoUser);
router.get('/info', authMiddleware.verifyToken, authMiddleware.checkPermission(1,2), Binnacle.Prepare_bitacora, userControllers.infoUser);

// Ruta para actualizar de usuario
//router.put('/update', authMiddleware.verifyToken, userControllers.updateUser);
router.put('/update', authMiddleware.verifyToken, authMiddleware.checkPermission(1,3), Binnacle.Prepare_bitacora, userControllers.updateUser);
router.get("/schools", userControllers.getSchools);


//router.get('/practica', authMiddleware.BitacoraMiddleware);

// ===================== Exportaciones =====================
module.exports = router;