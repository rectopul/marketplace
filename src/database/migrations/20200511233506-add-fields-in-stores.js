'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addColumn('stores', 'nameStore', {
                type: Sequelize.STRING,
                unique: true,
            })
            await queryInterface.addColumn('stores', 'lastName', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('stores', 'cpf', {
                type: Sequelize.STRING,
                unique: true,
            })
            await queryInterface.addColumn('stores', 'rg', {
                type: Sequelize.STRING,
                unique: true,
            })
            await queryInterface.addColumn('stores', 'issuer', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('stores', 'issueDate', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('stores', 'birthDate', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('stores', 'countryCode', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('stores', 'district', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('stores', 'country', {
                type: Sequelize.STRING,
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
