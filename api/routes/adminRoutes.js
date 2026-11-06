// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const adminControllers = require('../controllers/adminControllers')
const Binnacle = require('../middlewares/Binnacle')

// ===================== Rutas =====================
router.post('/createRole', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(10, 1), adminControllers.createRole, Binnacle.Prepare_bitacora);
router.get('/roles', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(10, 2), adminControllers.roleList);

//router.post('/createRole', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), adminControllers.createRole);
router.post('/createRole', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(10,1) , adminControllers.createRole, Binnacle.Prepare_bitacora);
router.get('/roles', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(10,2), adminControllers.roleList);
router.post('/createUser', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1, 1), adminControllers.createUser, Binnacle.Prepare_bitacora);
router.get('/getUsers', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1, 2), adminControllers.getUsers);
router.get('/users', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1, 2), adminControllers.users);
router.put('/updateUser/:id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1, 3), adminControllers.updateUser, Binnacle.Prepare_bitacora);
router.delete('/deleteUser/:idD', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1, 4), adminControllers.deleteUser, Binnacle.Prepare_bitacora);
router.patch('/reactivateUser/:idD', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), authMiddleware.checkPermission(1, 3), adminControllers.reactivateUser);

// ===================== Exportaciones =====================
module.exports = router;