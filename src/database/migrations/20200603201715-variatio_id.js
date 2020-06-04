'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('variations', 'variation_id', {
            type: Sequelize.INTEGER,
            references: { model: 'variations', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('variations', 'variation_id')
    },
}
