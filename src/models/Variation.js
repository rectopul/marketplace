const { Model, DataTypes } = require("sequelize");

class Variation extends Model {
    static init(sequelize) {
        super.init(
            {
                attribute_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                attribute_value: DataTypes.STRING,
                variation_menu_order: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`
                        }
                    }
                },
                upload_image_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`
                        }
                    }
                },
                variable_sku: DataTypes.STRING,
                variable_enabled: DataTypes.STRING,
                variable_regular_price: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        },
                        isDecimal: {
                            msg: `This field must be a decimal value`
                        }
                    }
                },
                variable_sale_price: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`
                        }
                    }
                },
                variable_sale_price_dates_from: DataTypes.STRING,
                variable_sale_price_dates_to: DataTypes.STRING,
                variable_stock: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`
                        }
                    }
                },
                variable_original_stock: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`
                        }
                    }
                },
                variable_stock_status: DataTypes.STRING,
                variable_weight: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`
                        }
                    }
                },
                variable_length: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`
                        }
                    }
                },
                variable_width: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`
                        }
                    }
                },
                variable_height: {
                    type: DataTypes.STRING,
                    validate: {
                        isDecimal: {
                            msg: `This field must be a decimal value`
                        }
                    }
                },
                variable_shipping_class: DataTypes.STRING,
                variable_description: DataTypes.STRING
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "variable_store_id", as: "store" });
        this.hasMany(models.VariablesMap, { foreignKey: 'variation_id', as: 'variablemap', });
        this.hasMany(models.CartProduct, { foreignKey: `product_id`, as: `cartProduct` })
    }
}

module.exports = Variation;
