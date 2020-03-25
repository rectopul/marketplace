'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("images_banners", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false
      },
      key: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      url: {
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

      Example: /mnt/d/jobs/node/instacheckout/src/database/migrations/20200125192548-create-table-images-product.js
      return queryInterface.dropTable('images_products');
    */
    return queryInterface.dropTable('images_banners');
  }
};
