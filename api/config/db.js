const Sequelize = require('sequelize');

//  ==================================================

const sequelize = new Sequelize('learnix', 'postgres', '0000', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;