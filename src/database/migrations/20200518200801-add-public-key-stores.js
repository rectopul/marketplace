'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('stores', 'public_key', {
            type: Sequelize.TEXT,
            unique: true,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('stores', 'public_key')
    },
}
