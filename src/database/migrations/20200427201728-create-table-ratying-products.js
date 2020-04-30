'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        return queryInterface.createTable('product_ratings', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'products', key: 'id' },
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
            store_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'stores', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            rate: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            comment: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
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
        return queryInterface.dropTable('product_ratings')
    },
}
