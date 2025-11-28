// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const adminControllers = require('../controllers/adminControllers')
const Binnacle = require('../middlewares/Binnacle')

// ===================== Rutas =====================

//router.post('/createRole', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), adminControllers.createRole);
router.post('/createRole', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(5,1) , adminControllers.createRole, Binnacle.Prepare_bitacora);
router.get('/roles', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), adminControllers.roleList);
router.post('/createUser', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1, 1), adminControllers.createUser);
//router.delete('/deleteUser', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), adminControllers.deleteUser);
router.delete('/deleteUser/:idD', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1,4), Binnacle.Prepare_bitacora ,adminControllers.deleteUser);
router.get('/users', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), adminControllers.getUsers);
router.get('/course', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), adminControllers.getCourses);

// ===================== Exportaciones =====================
module.exports = router;