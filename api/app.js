// ===================== Importaciones =====================
const express = require('express');
const cors = require('cors');

require('./triggers/periodTrigger.js');

// Importar rutas
const { BitacoraMiddleware  } = require('./middlewares/Binnacle')
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const rectorRoutes = require('./routes/rectorRoutes');

// Importar modelos y base de datos
const { db, Role, User, Period, ReportCard, Subject, Grade, Year, Course, ClassSection, ClassSubject, StudentClass, Entity, Action, Permission, RolePermission, Binnacle, School } = require('./models');
const seedDatabase = require('./config/seeder');

// ===================== Configuración del servidor =====================
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// ===================== Rutas =====================
app.use('/api/rector', rectorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/user', userRoutes);

// ===================== Bitacora =====================
app.use(BitacoraMiddleware);

// ===================== Inicialización =====================
app.listen(PORT, async () => {
    try {
        // Sincronizar base de datos
        await db.sync({ force: false });
        // await seedDatabase();
        console.log(`Servidor corriendo en el puerto ${PORT}.`);
    } catch (err) {
        console.error('Error al sincronizar la base de datos:', err);
    }
});