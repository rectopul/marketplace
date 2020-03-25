const { Model, DataTypes } = require("sequelize");

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                sku: DataTypes.STRING,
                title: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                description: DataTypes.TEXT,
                except: DataTypes.STRING,
                stock: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be an integer`
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                weight: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                width: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                height: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                length: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                price: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                promotional_price: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`
                        }
                    }
                },
                cust_price: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: `This field must be a decimal number`
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                brand: DataTypes.STRING,
                model: DataTypes.STRING,
                frete_class: DataTypes.STRING,

            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "stores" });
        this.hasMany(models.ImagesProducts, { foreignKey: 'product_id', as: 'images_products' });
        this.hasMany(models.CategoryMap, { foreignKey: 'product_id', as: 'product_categories_map', });
        this.hasMany(models.VariablesMap, { foreignKey: 'product_id', as: 'variations', });
    }
}

module.exports = Product;
