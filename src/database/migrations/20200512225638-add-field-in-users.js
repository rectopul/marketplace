'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addColumn('users', 'phone', {
                type: Sequelize.STRING,
                unique: true,
            })
            await queryInterface.addColumn('users', 'cell', {
                type: Sequelize.STRING,
                unique: true,
            })

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    down: async (queryInterface) => {
        try {
            await queryInterface.removeColumn('users', 'phone')
            await queryInterface.removeColumn('users', 'receiver_name')
            await queryInterface.removeColumn('delivery_addresses', 'cell')

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    },
}
