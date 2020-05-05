'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('delivery_addresses', 'street', {
            type: Sequelize.STRING,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('delivery_addresses', 'street')
    },
}
