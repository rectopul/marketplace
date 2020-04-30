const { Model, DataTypes } = require('sequelize')

class Stores extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        isEmail: {
                            msg: `This field must be an email`,
                        },
                    },
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g,
                            msg: `This field must be a phone`,
                        },
                    },
                },
                cell: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g,
                            msg: `This field must be a cell`,
                        },
                    },
                },
                url: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        isUrl: {
                            msg: `This value must be a url`,
                        },
                    },
                },
                zipcode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                number: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
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
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.hasMany(models.Banners, {
            foreignKey: 'store_id',
            as: 'banners',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Product, {
            foreignKey: 'store_id',
            as: 'products',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Categories, {
            foreignKey: 'store_id',
            as: 'categories',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.CategoryMap, {
            foreignKey: 'store_id',
            as: 'store_categories_map',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Variation, {
            foreignKey: 'store_id',
            as: 'variable',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.VariablesMap, {
            foreignKey: 'product_id',
            as: 'variablemap',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.CartProduct, {
            foreignKey: `product_id`,
            as: `cartProduct`,
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.User, {
            foreignKey: 'store_id',
            as: 'managers',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Order, {
            foreignKey: 'store_id',
            as: 'order',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.ProductsOrder, {
            foreignKey: 'store_id',
            as: 'order_map',
            onDelete: 'cascade',
            hooks: true,
        })
    }
}

module.exports = Stores
