const { Model, DataTypes } = require('sequelize')

class VariablesMap extends Model {
    static init(sequelize) {
        super.init(
            {
                variable_sku: DataTypes.STRING,
                variable_regular_price: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        isDecimal: {
                            msg: `This field must be a decimal value`,
                        },
                    },
                },
                variable_sale_price: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`,
                        },
                    },
                },
                variable_sale_price_dates_from: DataTypes.STRING,
                variable_sale_price_dates_to: DataTypes.STRING,
                variable_stock: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`,
                        },
                    },
                },
                variable_original_stock: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`,
                        },
                    },
                },
                variable_stock_status: DataTypes.STRING,
                variable_weight: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`,
                        },
                    },
                },
                variable_length: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`,
                        },
                    },
                },
                variable_width: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`,
                        },
                    },
                },
                variable_height: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`,
                        },
                    },
                },
                variable_shipping_class: DataTypes.STRING,
                variable_description: DataTypes.STRING,
            },
            { sequelize }
        )
    }

    static associate(models) {
        this.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        })
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'store' })
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsTo(models.Variation, {
            foreignKey: 'variation_id',
            as: 'variation_info',
        })
        this.belongsTo(models.Image, {
            foreignKey: `upload_image_id`,
            as: `image`,
        })
        this.hasMany(models.ProductsOrder, {
            foreignKey: 'variation_id',
            as: 'order_map',
        })
    }
}

module.exports = VariablesMap
