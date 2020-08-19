'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
    up: (queryInterface) => {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
        return queryInterface.bulkInsert('users', [
            {
                name: 'Rogério Bonfim',
                email: 'example@example.com',
                password_hash: bcrypt.hashSync('123mudar', 8),
                phone: '99 9999-9999',
                cell: '99 9999-9999',
                type: 'super',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    down: (queryInterface, Sequelize) => {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
        return queryInterface.bulkDelete('users', null, {})
    },
}
