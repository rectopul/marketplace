'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('stores', 'image_id', {
            type: Sequelize.INTEGER,
            references: { model: 'images', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('stores', 'image_id')
    },
}
