const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    school_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    date_of_birth: {
        type: DataTypes.DATEONLY
    },
    phone: {
        type: DataTypes.STRING(10)
    },
    cuil: {
        type: DataTypes.BIGINT,
        unique: true
    },
    tuition: {
        type: DataTypes.INTEGER,
        unique: true
    },
    email: {
        type: DataTypes.STRING(150),
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING(255)
    }, isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false,
    tableName: 'users'
});

module.exports = User;