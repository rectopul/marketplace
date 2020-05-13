'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addColumn('clients', 'birth_date', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'cpf', {
                type: Sequelize.STRING,
                unique: true,
            })
            await queryInterface.addColumn('clients', 'country_code', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'phone_number', {
                type: Sequelize.STRING,
                unique: true,
            })
            await queryInterface.addColumn('clients', 'street', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'street_number', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'complement', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'district', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'city', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'state', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'country', {
                type: Sequelize.STRING,
            })
            await queryInterface.addColumn('clients', 'zip_code', {
                type: Sequelize.STRING,
            })

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    down: async (queryInterface) => {
        try {
            await queryInterface.addColumn('clients', 'birthDate')
            await queryInterface.removeColumn('clients', 'cpf')
            await queryInterface.removeColumn('clients', 'countryCode')
            await queryInterface.removeColumn('clients', 'phoneNumber')
            await queryInterface.removeColumn('clients', 'street')
            await queryInterface.removeColumn('clients', 'streetNumber')
            await queryInterface.removeColumn('clients', 'complement')
            await queryInterface.removeColumn('clients', 'district')
            await queryInterface.removeColumn('clients', 'city')
            await queryInterface.removeColumn('clients', 'state')
            await queryInterface.removeColumn('clients', 'country')
            await queryInterface.removeColumn('clients', 'zip_code')

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    },
}
