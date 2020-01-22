'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      campos do produto{
        store_id
        sku
        titulo
        descriçao
        except
        stock
        weight
        width
        height
        length
        price
        promotional_price
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
            unique: true,
            allowNull: false
        },
        titulo: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        descriçao: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        except: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        weight: {
            type: Sequelize.STRING,
            allowNull: false
        },
        width: {
            type: Sequelize.STRING,
            allowNull: false
        },
        height: {
            type: Sequelize.STRING,
            allowNull: false
        },
        length: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.STRING,
            allowNull: false
        },
        promotional_price: {
            type: Sequelize.STRING,
            allowNull: false
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
  }
};
