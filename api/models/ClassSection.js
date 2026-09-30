const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const ClassSection = sequelize.define('ClassSection', {
    year_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    courses_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    code: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false,
    tableName: 'class_sections'
});

module.exports = ClassSection;