'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.createTable('variables_maps', {
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
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "products", key: "id" },
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
      variation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "variations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      variable_sku: {
        type: Sequelize.STRING
      },
      upload_image_id: {
        type: Sequelize.INTEGER,
      },
      variable_regular_price: {
        type: Sequelize.STRING,
        allowNull: false
      },
      variable_sale_price: {
        type: Sequelize.STRING,
      },
      variable_sale_price_dates_from: {
        type: Sequelize.DATE
      },
      variable_sale_price_dates_to: {
        type: Sequelize.DATE
      },
      variable_original_stock: {
        type: Sequelize.INTEGER,
      },
      variable_stock_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      variable_weight: {
        type: Sequelize.STRING,
      },
      variable_length: {
        type: Sequelize.STRING,
      },
      variable_width: {
        type: Sequelize.STRING,
      },
      variable_height: {
        type: Sequelize.STRING,
      },
      variable_stock: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      variable_shipping_class: {
        type: Sequelize.STRING,
      },
      variable_description: {
        type: Sequelize.TEXT,
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.dropTable('variables_maps');
  }
};//20200204221853-create-table-variations-maps.js
