'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('clients', 'wire_id', {
            type: Sequelize.STRING,
            unique: true,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('clients', 'wire_id')
    },
}
