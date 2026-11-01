const cron = require("node-cron");
const { Period, User, ReportCard, School, Role } = require("../models");

function hoy() {
    return new Date().toISOString().split("T")[0];
}

cron.schedule("*/10 * * * * *", async () => {
    const today = hoy();
    console.log("Revisando períodos para:", today);
    
    const periodsInit = await Period.findAll({
        where: { date_init: today },
        include: [
            {
                model: School,
                as: "school",
                attributes: ["name"]
            }
        ]
    });

    for (const period of periodsInit) {
        if (period.init_executed) continue;

        console.log(`Periodo iniciado: ${period.name}; Escuela: ${period.school.name}`);

        const students = await User.findAll({
            where: {
                school_id: period.school_id,
                role_id: 4
            }
        });

        for (const student of students) {
            await ReportCard.create({
                student_id: student.id,
                period_id: period.id,
                school_id: period.school_id
            });
        }

        console.log(`Se crearon boletines para ${students.length} estudiantes`);

        period.init_executed = true;
        await period.save();
    }

    const periodsEnd = await Period.findAll({
        where: { date_end: today },
        include: [
            {
                model: School,
                as: "school",
                attributes: ["name"]
            }
        ]
    });

    for (const period of periodsEnd) {
        if (period.end_executed) continue;

        console.log(`Periodo finalizado: ${period.name}; Escuela: ${period.school.name}`);

        // Lógica futura para bloquear notas

        period.end_executed = true;
        await period.save();
    }
});