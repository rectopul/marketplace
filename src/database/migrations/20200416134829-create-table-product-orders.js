'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        return queryInterface.createTable('products_orders', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            store_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'stores', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'orders', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            client_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'clients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'products', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            variation_id: {
                type: Sequelize.INTEGER,
                references: { model: 'variables_maps', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    down: (queryInterface) => {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity. src/database/migrations/20200209195335-create-table-ordering-products.js

      Example:
      */
        return queryInterface.dropTable('products_orders')
    },
}
