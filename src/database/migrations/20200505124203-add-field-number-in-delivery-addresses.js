'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('delivery_addresses', 'number', {
            type: Sequelize.INTEGER,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('delivery_addresses', 'number')
    },
}
