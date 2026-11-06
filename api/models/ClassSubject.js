const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const ClassSubject = sequelize.define('ClassSubject', {
    class_section_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'class_subjects'
});

module.exports = ClassSubject;