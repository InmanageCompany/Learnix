const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const ReportCard = sequelize.define('ReportCard', {
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    period_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    school_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'report_cards'
});

module.exports = ReportCard;