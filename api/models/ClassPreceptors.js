const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const ClassPreceptor = sequelize.define('ClassPreceptor', {
    class_section_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    preceptor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'class_preceptor'
});

module.exports = ClassPreceptor;