'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      campos do produto{
        id
        store_id
        sku
        title
        description
        except
        stock
        weight
        width
        height
        length
        price
        promotional_price
        cust_price
        brand
        model
        frete_class
      }*/
      return queryInterface.createTable("products", {
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
        sku: {
            type: Sequelize.STRING,
            unique: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        except: {
            type: Sequelize.STRING,
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        weight: {
            type: Sequelize.STRING
        },
        width: {
            type: Sequelize.STRING
        },
        height: {
            type: Sequelize.STRING
        },
        length: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.STRING,
            allowNull: false
        },
        promotional_price: {
            type: Sequelize.STRING
        },
        cust_price: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        model: {
            type: Sequelize.STRING
        },
        frete_class: {
            type: Sequelize.STRING,
            allowNull: false
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
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('products');
  }
};
