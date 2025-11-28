const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Period = sequelize.define('Period', {
    school_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    date_init: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    date_end: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    init_executed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    end_executed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
    tableName: 'periods'
});

module.exports = Period;