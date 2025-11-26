// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const teacherControllers = require('../controllers/teacherControllers');
const rectorControllers = require('../controllers/rectorControllers')

// ===================== Rutas =====================

router.post('/register', teacherControllers.registerTeacher);
router.get('/courses', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.teacherCourses);
router.put('/codeCourse', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.codeCourse);
router.get('/students/:ClassSection_id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.teacherStudents);
router.get('/periods', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), rectorControllers.Period_List);
router.get('/subjects', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.teacherSubject);
router.post('/addGrade', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.teacherAddNotes);
router.get('/seeGrade/:student_id/:subject_id/:period_id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.teacherSeeGrade);
router.put('/updateGrade', authMiddleware.verifyToken, authMiddleware.authorizeRole(['teacher']), teacherControllers.teacherUpdateGrade);

// ===================== Exportaciones =====================
module.exports = router;