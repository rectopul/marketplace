'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addColumn('products', 'reference', {
                type: Sequelize.STRING,
            })

            await queryInterface.addColumn('products', 'included_items', {
                type: Sequelize.STRING,
            })

            await queryInterface.addColumn('products', 'availability', {
                type: Sequelize.STRING,
            })

            await queryInterface.addColumn('products', 'stock_alert', {
                type: Sequelize.BOOLEAN,
            })

            await queryInterface.addColumn('products', 'video', {
                type: Sequelize.TEXT,
            })

            return Promise.resolve()
        } catch (error) {
            return Promise.reject()
        }
    },

    down: async (queryInterface) => {
        try {
            await queryInterface.removeColumn('products', 'reference')
            await queryInterface.removeColumn('products', 'included_items')
            await queryInterface.removeColumn('products', 'availability')
            await queryInterface.removeColumn('products', 'stock_alert')
            await queryInterface.removeColumn('products', 'video')

            return Promise.resolve()
        } catch (error) {
            return Promise.reject()
        }
    },
}
