'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('shippings', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'orders', key: 'id' },
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
                allowNull: false,
                references: { model: 'variables_maps', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            code: {
                type: Sequelize.TEXT,
                unique: true,
                allowNull: false,
            },
            company_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            company_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            delivery_range_min: {
                type: Sequelize.INTEGER,
            },
            delivery_range_max: {
                type: Sequelize.INTEGER,
            },
            dimensions_height: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            dimensions_width: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            dimensions_length: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            dimensions_weight: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            format: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            insurance_value: {
                type: Sequelize.DECIMAL,
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
        return queryInterface.dropTable('shippings')
    },
}
