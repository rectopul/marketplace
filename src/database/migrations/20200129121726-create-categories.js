"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("categories", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            store_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "stores", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT
            },
            parent: {
                type: Sequelize.STRING
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            characteristics: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("categories");
    }
};
