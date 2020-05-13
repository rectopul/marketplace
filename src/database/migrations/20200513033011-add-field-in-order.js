'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('orders', 'order', {
            type: Sequelize.STRING,
            unique: true,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('orders', 'order')
    },
}
