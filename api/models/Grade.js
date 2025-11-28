const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Grade = sequelize.define('Grade', {
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    report_card_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    grade_value: {
        type: DataTypes.STRING(255)
    },
    comment: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'grades'
});

module.exports = Grade;