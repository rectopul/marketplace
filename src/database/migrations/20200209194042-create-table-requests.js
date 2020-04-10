'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.createTable('orders', {
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
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "clients", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "carts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      total: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.DataTypes.STRING
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
      Return a promise to correctly handle asynchronicity. src/database/migrations/20200209194042-create-table-requests.js

      Example:
      */
    return queryInterface.dropTable('orders');
  }
};
