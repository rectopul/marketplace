'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('categories', 'image_id', {
            type: Sequelize.INTEGER,
            references: { model: 'images', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('categories', 'image_id')
    },
}
