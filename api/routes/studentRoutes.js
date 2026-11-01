// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const studentControllers = require('../controllers/studentControllers')

// ===================== Rutas =====================

// Ruta para visualizar boletines
router.get('/reportCards', authMiddleware.verifyToken, authMiddleware.authorizeRole(['student']), studentControllers.studentReports);

// Ruta para visualizar notas
router.get('/notes/:report_card_id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['student']), studentControllers.studentNotes);

// ===================== Exportaciones =====================
module.exports = router;