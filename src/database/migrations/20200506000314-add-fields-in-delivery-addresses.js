'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addColumn('delivery_addresses', 'phone', {
                type: Sequelize.STRING,
                allowNull: false,
            })
            await queryInterface.addColumn('delivery_addresses', 'receiver_name', {
                type: Sequelize.STRING,
                allowNull: false,
            })
            await queryInterface.addColumn('delivery_addresses', 'address_type', {
                type: Sequelize.STRING,
                allowNull: false,
            })
            await queryInterface.addColumn('delivery_addresses', 'additional_information', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('delivery_addresses', 'delivery_instructions', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('delivery_addresses', 'delivery_number', {
                type: Sequelize.INTEGER,
            })

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    down: async (queryInterface) => {
        try {
            await queryInterface.removeColumn('delivery_addresses', 'phone')
            await queryInterface.removeColumn('delivery_addresses', 'receiver_name')
            await queryInterface.removeColumn('delivery_addresses', 'address_type')
            await queryInterface.removeColumn('delivery_addresses', 'additional_information')
            await queryInterface.removeColumn('delivery_addresses', 'delivery_instructions')
            await queryInterface.removeColumn('delivery_addresses', 'delivery_number')

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    },
}
