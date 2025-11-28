const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const School = sequelize.define("School", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: 'schools'
});

module.exports = School;