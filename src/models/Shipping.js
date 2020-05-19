const { DataTypes, Model } = require('sequelize')

class Shipping extends Model {
    static init(sequelize) {
        super.init(
            {
                code: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The code field cannot be null`,
                        },
                    },
                },
                companyName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The companyName field cannot be null`,
                        },
                    },
                },
                companyCode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The companyCode field cannot be null`,
                        },
                    },
                },
                price: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `price cannot be empty`,
                        },
                        notNull: {
                            msg: `price cannot be null`,
                        },
                        isDecimal: {
                            msg: `The price field must be a decimal number`,
                        },
                    },
                },
                deliveryRangeMin: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The deliveryRangeMin field cannot be empty`,
                        },
                        notNull: {
                            msg: `The deliveryRangeMin field cannot be null`,
                        },
                        isInt: {
                            msg: `The deliveryRangeMin field must be a integer number`,
                        },
                    },
                },
                deliveryRangeMax: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The deliveryRangeMax field cannot be empty`,
                        },
                        notNull: {
                            msg: `The deliveryRangeMax field cannot be null`,
                        },
                        isInt: {
                            msg: `The deliveryRangeMin field must be a integer number`,
                        },
                    },
                },
                dimensionsHeight: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `dimensionsHeight cannot be empty`,
                        },
                        notNull: {
                            msg: `dimensionsHeight cannot be null`,
                        },
                        isDecimal: {
                            msg: `The dimensionsHeight field must be a decimal number`,
                        },
                    },
                },
                dimensionsWidth: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `dimensionsWidth cannot be empty`,
                        },
                        notNull: {
                            msg: `dimensionsWidth cannot be null`,
                        },
                        isDecimal: {
                            msg: `The dimensionsWidth field must be a decimal number`,
                        },
                    },
                },
                dimensionsLength: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `dimensionsLength cannot be empty`,
                        },
                        notNull: {
                            msg: `dimensionsLength cannot be null`,
                        },
                        isDecimal: {
                            msg: `The dimensionsLength field must be a decimal number`,
                        },
                    },
                },
                dimensionsWeight: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `dimensionsWeight cannot be empty`,
                        },
                        notNull: {
                            msg: `dimensionsWeight cannot be null`,
                        },
                        isDecimal: {
                            msg: `The dimensionsWeight field must be a decimal number`,
                        },
                    },
                },
                format: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `format cannot be empty`,
                        },
                        notNull: {
                            msg: `format cannot be null`,
                        },
                    },
                },
                insuranceValue: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `insuranceValue cannot be empty`,
                        },
                        notNull: {
                            msg: `insuranceValue cannot be null`,
                        },
                        isDecimal: {
                            msg: `The insuranceValue field must be a decimal number`,
                        },
                    },
                },
                status: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The active field cannot be empty`,
                        },
                    },
                },
            },
            { sequelize }
        )
    }

    static associate(models) {
        this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' })
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'store' })
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
        this.belongsTo(models.VariablesMap, { foreignKey: 'variation_id', as: 'variation' })
    }
}

module.exports = Shipping
