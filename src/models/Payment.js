const { Model, DataTypes } = require('sequelize')

class Payment extends Model {
    static init(sequelize) {
        super.init(
            {
                payment_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This payment_id cannot be empty`,
                        },
                        notNull: {
                            msg: `The payment_id brand cannot be null`,
                        },
                    },
                },
                value: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {
                            msg: `The value field is integer number`,
                        },
                        notEmpty: {
                            msg: `The value field cannot be empty`,
                        },
                        notNull: {
                            msg: `The value field brand cannot be null`,
                        },
                    },
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The status field cannot be empty`,
                        },
                        notNull: {
                            msg: `The status field brand cannot be null`,
                        },
                    },
                },
                method: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The method field cannot be empty`,
                        },
                        notNull: {
                            msg: `The method field brand cannot be null`,
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
        this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' })
    }
}

module.exports = Payment
