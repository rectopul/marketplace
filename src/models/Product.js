const { Model, DataTypes } = require('sequelize')

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                sku: DataTypes.STRING,
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                description: DataTypes.STRING,
                except: DataTypes.STRING,
                stock: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {
                            msg: `The stock field must be an integer`,
                        },
                        notEmpty: {
                            msg: `The stock field cannot be empty`,
                        },
                    },
                },
                weight: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`,
                        },
                        notEmpty: {
                            msg: `The weight field cannot be empty`,
                        },
                    },
                },
                width: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        isFloat: {
                            msg: `The width field must be a decimal number`,
                        },
                        notEmpty: {
                            msg: `The width field cannot be empty`,
                        },
                    },
                },
                height: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        isFloat: {
                            msg: `The height field must be a decimal number`,
                        },
                        notEmpty: {
                            msg: `The height field cannot be empty`,
                        },
                    },
                },
                length: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        isFloat: {
                            msg: `The length field must be a decimal number`,
                        },
                        notEmpty: {
                            msg: `The length field cannot be empty`,
                        },
                    },
                },
                price: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        isFloat: {
                            msg: `The price field must be a decimal number`,
                        },
                        notEmpty: {
                            msg: `The price field cannot be empty`,
                        },
                    },
                },
                promotional_price: {
                    type: DataTypes.STRING,
                },
                cust_price: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                brand: DataTypes.STRING,
                model: DataTypes.STRING,
                frete_class: DataTypes.STRING,
                reference: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The reference field cannot be empty`,
                        },
                    },
                },
                included_items: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The included_items field cannot be empty`,
                        },
                    },
                },
                availability: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The availability field cannot be empty`,
                        },
                    },
                },
                stock_alert: {
                    type: DataTypes.BOOLEAN,
                    validate: {
                        notEmpty: {
                            msg: `The stock_alert field cannot be empty`,
                        },
                        isBoolean: function (val) {
                            return typeof val == 'boolean'
                        },
                    },
                },
                video: {
                    type: DataTypes.BOOLEAN,
                    validate: {
                        notEmpty: {
                            msg: `The video field cannot be empty`,
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
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'stores' })
        this.hasMany(models.ImagesProducts, { foreignKey: 'product_id', as: 'images_product' })
        this.hasMany(models.CategoryMap, { foreignKey: 'product_id', as: 'categories' })
        this.hasMany(models.VariablesMap, { foreignKey: 'product_id', as: 'variations' })
        this.hasMany(models.CartProduct, { foreignKey: `product_id`, as: `cartProduct` })
        this.hasMany(models.ProductsOrder, { foreignKey: 'product_id', as: 'order_map' })
        this.hasMany(models.ProductRating, { foreignKey: `product_id`, as: `rating` })
    }
}

module.exports = Product
