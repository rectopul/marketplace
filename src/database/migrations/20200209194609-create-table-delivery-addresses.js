'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example: src/database/migrations/20200209194609-create-table-delivery-addresses.js
      */
        return queryInterface.createTable('delivery_addresses', {
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
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            cpf: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            street: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            zipcode: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            address_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            additional_information: {
                type: Sequelize.STRING,
            },
            delivery_instructions: {
                type: Sequelize.STRING,
            },
            delivery_number: {
                type: Sequelize.INTEGER,
            },
            active: {
                type: Sequelize.BOOLEAN,
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
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        return queryInterface.dropTable('delivery_addresses')
    },
}
