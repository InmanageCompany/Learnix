const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Absences = sequelize.define('Absences', {
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    period_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'absences'
});

module.exports = Absences;