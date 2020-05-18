const { Model, DataTypes } = require('sequelize')

class ClientCard extends Model {
    static init(sequelize) {
        super.init(
            {
                brand: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        notNull: {
                            msg: `The field brand cannot be null`,
                        },
                    },
                },
                first: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The first field cannot be empty`,
                        },
                        notNull: {
                            msg: `The first field brand cannot be null`,
                        },
                    },
                },
                last: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The last field cannot be empty`,
                        },
                        notNull: {
                            msg: `The last field brand cannot be null`,
                        },
                    },
                },
                hash: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: {
                        msg: `This hash already exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The hash field cannot be empty`,
                        },
                        notNull: {
                            msg: `The hash field brand cannot be null`,
                        },
                    },
                },
                card_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This card_id already exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The card_id field cannot be empty`,
                        },
                        notNull: {
                            msg: `The card_id field brand cannot be null`,
                        },
                    },
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}

module.exports = ClientCard
