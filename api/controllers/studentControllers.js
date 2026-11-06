// ===================== Importaciones =====================
const { Grade, Subject, ReportCard, Period, Binnacle } = require('../models');
const { Op } = require('sequelize');

// ===================== Controladores =====================

// Obtener notas de un estudiante
const studentNotes = async (req, res) => {
    const { report_card_id } = req.params;

    try {
        const grades = await Grade.findAll({
            where: { report_card_id: report_card_id },
            include: [
                { model: Subject, as: 'subject' }
            ]
        });

        if (!grades) {
            return res.status(404).json({ message: 'No se encontro ninguna nota en el boletin' });
        }

        res.json(grades);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
}

// Obtener notas de un estudiante modificadas recientemente
const studentNotesMod = async (req, res) => {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    try {

        const parsear = (valor) => {
            if (typeof valor !== 'string') return valor;
            try {
                return JSON.parse(valor);
            } catch {
                return valor; // si no era JSON válido, lo deja como estaba
            }
        };

        const registros = await Binnacle.findAll({
            where: {
                created_at: { [Op.gte]: hace7Dias },
                table: "Grade"
            }, order: [['created_at', 'DESC']]
        });

        if (registros.length == 0) {
            return res.status(404).json({ message: 'No se encontro ninguna nota modficada recientemente' });
        }

        const seen = new Set();
        const gradesMod = registros.filter(gr => {
            if (seen.has(gr.entity_id)) return false;
            seen.add(gr.entity_id);
            return true;
        });

        // Una sola consulta para todas las notas
        const ids = gradesMod.map(gr => gr.entity_id);
        const notas = await Grade.findAll({
            where: { id: { [Op.in]: ids } },
            include: [
                { model: Subject, as: 'subject' },
                { model: ReportCard, as: 'report_card', include: [{ model: Period, as: "period" }] }
            ]
        });

        // Para cruzar cada nota con su old_value de la bitácora
        const notasPorId = new Map(notas.map(n => [n.id, n]));

        const filgra = gradesMod
            .filter(gr => notasPorId.has(gr.entity_id))
            .map(gr => {
                const nota = notasPorId.get(gr.entity_id);
                const anterior = parsear(gr.old_value) ?? {};
                return {
                    subject: nota.subject.name,
                    grade_value: nota.grade_value,
                    comment: nota.comment,
                    old_grade_value: anterior.grade_value,
                    old_comment: anterior.comment,
                    period: nota.report_card.period.name
                };
            });

        res.json(filgra);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
}

// Obtener boletines de un estudiante
const studentReports = async (req, res) => {
    const id = req.user.id;

    try {
        const reports = await ReportCard.findAll({
            where: { student_id: id },
            include: [
                { model: Period, as: 'period' }
            ]
        });

        if (!reports) {
            return res.status(404).json({ message: 'No se encontro ninguna nota en el boletin' });
        }

        res.json(reports);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
}

// ===================== Exportaciones =====================
module.exports = {
    studentNotes,
    studentNotesMod,
    studentReports
};