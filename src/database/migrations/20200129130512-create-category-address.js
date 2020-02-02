"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("category_maps", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "categories", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            store_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "stores", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            product_id: {
                type: Sequelize.INTEGER,
                references: { model: "products", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
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
        return queryInterface.dropTable("category_maps");
    }
};
