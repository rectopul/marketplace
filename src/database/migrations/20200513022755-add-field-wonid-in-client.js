'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('clients', 'own_id', {
            type: Sequelize.STRING,
            unique: true,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('clients', 'own_id')
    },
}
