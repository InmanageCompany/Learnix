// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const teacherControllers = require('../controllers/teacherControllers');
const Binnacle = require('../middlewares/Binnacle')
const rectorControllers = require('../controllers/rectorControllers')

// ===================== Rutas =====================

router.post('/register', teacherControllers.registerTeacher);
router.get('/courses', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), authMiddleware.checkPermission(13,2), teacherControllers.teacherCourses);
router.put('/codeCourse', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.codeCourse);
router.get('/students/:ClassSection_id/:subject_id/:period_id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), authMiddleware.checkPermission(1,2), teacherControllers.teacherStudents);
router.get('/periods', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), authMiddleware.checkPermission(6,2), rectorControllers.Period_List);
router.get('/subjects', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), authMiddleware.checkPermission(13,2), teacherControllers.teacherSubject);
router.post('/addGrade', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), authMiddleware.checkPermission(2,1),teacherControllers.teacherAddGrades, Binnacle.Prepare_bitacora);
router.get('/seeGrade/:student_id/:subject_id/:period_id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), authMiddleware.checkPermission(2,2), teacherControllers.teacherSeeGrade);
router.put('/updateGrade', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), authMiddleware.checkPermission(2,3), Binnacle.Prepare_bitacora ,teacherControllers.teacherUpdateGrade);

// ===================== Exportaciones =====================
module.exports = router;