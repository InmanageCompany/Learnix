// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const rectorControllers = require('../controllers/rectorControllers')

//Ruta para obtener cursos
router.get('/class_section', authMiddleware.verifyToken, authMiddleware.authorizeRole(['rector']), authMiddleware.checkPermission(5,2), rectorControllers.ClassSection_List);

//Ruta para obtener materias
router.get('/subjects', authMiddleware.verifyToken, authMiddleware.authorizeRole(['rector']), authMiddleware.checkPermission(4,2), rectorControllers.Subject_List);

//Ruta para obtener bimestres
router.get('/periods', authMiddleware.verifyToken, authMiddleware.authorizeRole(['rector']), authMiddleware.checkPermission(6,2), rectorControllers.Period_List);


//Ruta para obtener permisos
router.get('/permission', authMiddleware.verifyToken, authMiddleware.authorizeRole(['rector']), authMiddleware.checkPermission(7,2), rectorControllers.Permission_List);

//Ruta para obtener boletines
router.get('/report_card', authMiddleware.verifyToken, authMiddleware.authorizeRole(['rector']), authMiddleware.checkPermission(3,2), rectorControllers.ReportCard_List);

//Ruta para obtener usuarios excepto admin
router.get('/users', authMiddleware.verifyToken, authMiddleware.authorizeRole(['rector']), authMiddleware.checkPermission(1,2), rectorControllers.User_List);

module.exports = router;