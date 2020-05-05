'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('clients', 'surname', {
            type: Sequelize.STRING,
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('clients', 'surname')
    },
}
