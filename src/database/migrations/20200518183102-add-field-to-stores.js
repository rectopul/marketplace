'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('stores', 'acess_token', {
            type: Sequelize.STRING,
            unique: true,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('stores', 'acess_token')
    },
}
