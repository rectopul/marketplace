'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        return queryInterface.createTable('order_deliveries', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
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
            store_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'stores', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            delivery_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'delivery_addresses', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            service: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            service_code: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
            },
            delivery_time: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            delivery_date: {
                type: Sequelize.DataTypes.DATE,
            },
            value: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            status: {
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
        return queryInterface.dropTable('order_deliveries')
    },
}
