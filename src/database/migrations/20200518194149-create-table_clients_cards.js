'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('client_cards', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            client_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'clients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            first: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            hash: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true,
            },
            card_id: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
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
        return queryInterface.dropTable('client_cards')
    },
}
