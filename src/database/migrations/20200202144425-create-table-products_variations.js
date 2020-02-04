'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      id,
      variable_product_id,
      attribute_name,
      variation_menu_order,
      upload_image_id,
      variable_sku,
      variable_enabled,
      variable_regular_price,
      variable_sale_price,
      variable_sale_price_dates_from,
      variable_sale_price_dates_to,
      variable_stock,
      variable_original_stock,
      variable_stock_status,
      variable_weight,
      variable_length,
      variable_width,
      variable_height,
      variable_shipping_class,
      variable_description
      Example:
      */
    return queryInterface.createTable('products_variations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      variable_store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "stores", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      variable_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      attribute_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      attribute_value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      variation_menu_order: {
        type: Sequelize.INTEGER,
      },
      upload_image_id: {
        type: Sequelize.INTEGER,
      },
      variable_sku: {
        type: Sequelize.STRING,
        unique: true
      },
      variable_enabled: {
        type: Sequelize.STRING
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
      variable_stock: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    return queryInterface.dropTable('products_variations');
  }
};
