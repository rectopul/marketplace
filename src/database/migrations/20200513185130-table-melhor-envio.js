'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('melhor_envios', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            code: {
                type: Sequelize.TEXT,
                unique: true,
                allowNull: false,
            },
            token: {
                type: Sequelize.TEXT,
                unique: true,
            },
            refresh_token: {
                type: Sequelize.TEXT,
                unique: true,
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            token_expires: {
                type: Sequelize.DATE,
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
        return queryInterface.dropTable('melhor_envios')
    },
}
