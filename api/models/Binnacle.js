const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Binnacle = sequelize.define('Binnacle', {
    responsible_id: {
        type: DataTypes.INTEGER
    },
    action: {
        type: DataTypes.STRING(255)
    },
    entity_id: {
        type: DataTypes.INTEGER
    },
    table: {
        type: DataTypes.STRING(255)
    },
    facts: {
        type: DataTypes.STRING(500)
    },
    old_value: {
        type: DataTypes.STRING(500)
    },
    new_value: {
        type: DataTypes.STRING(500)
    },
    created_at: {
        type: DataTypes.DATEONLY
    }
}, {
    timestamps: false,
    tableName: 'binnacles'
});

module.exports = Binnacle;