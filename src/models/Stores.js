const { Model, DataTypes } = require('sequelize')

class Stores extends Model {
    static init(sequelize) {
        super.init(
            {
                nameStore: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: {
                            msg: `The nameStore field cannot be empty`,
                        },
                    },
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The field lastName cannot be empty`,
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
                cpf: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: {
                            msg: `The cpf field cannot be empty`,
                        },
                        is: {
                            args: /([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})/g,
                            msg: `The cpf field must be a cpf`,
                        },
                    },
                },
                rg: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: {
                            msg: `The rg field cannot be empty`,
                        },
                    },
                },
                issuer: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The issuer field cannot be empty`,
                        },
                    },
                },
                issueDate: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The issueDate field cannot be empty`,
                        },
                    },
                },
                birthDate: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The birthDate field cannot be empty`,
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
                countryCode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        isNumeric: {
                            msg: `The countryCode field must be a two number`,
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
                district: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The district field cannot be empty`,
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
                country: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The country field cannot be empty`,
                        },
                        notNull: {
                            msg: `The country field cannot be empty`,
                        },
                    },
                },
                wirecardId: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.hasMany(models.OrderDelivery, { foreignKey: `store_id`, as: `order_delivery` })
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
